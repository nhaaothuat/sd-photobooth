"use client";

import { deleteBooth } from "@/services/booth-service";
import { columns } from "./columns";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Booth } from "@/types/booth";
import { Location } from "@/types/type";
import dynamic from "next/dynamic";

const CreateDialogForm = dynamic(
  () =>
    import("@/components/layouts/CreateDialog").then(
      (mod) => mod.MemoizedCreateDialogForm
    ),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const CrudPageWrapper = dynamic(
  () =>
    import("@/components/layouts/SharedPage").then(
      (mod) => mod.CrudPageWrapper
    ),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const boothSchema = z.object({
  boothName: z.string().min(1, "Required"),
  locationId: z.string().min(1, "Required"),
  description: z.string().optional(),
  status: z.boolean(),
});

export default function BoothPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await AxiosAPI.get<Location[]>("/api/Location");
        setLocations(res.data ?? []);
      } catch (error) {
        console.error("Failed to fetch locations", error);
        toast.error("Failed to load locations");
      }
    };

    fetchLocations();
  }, []);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Booth>({
    queryKey: "booths",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      const url = search?.trim()
        ? `/api/Booth/by-name/${search}`
        : `/api/Booth`;
      const res = await AxiosAPI.get<Booth[]>(url, {
        params: { PageNumber: page, PageSize: size },
      });

      const countRes = await AxiosAPI.get<number>("/api/Booth/count");
      return {
        items: res.data ?? [],
        totalItems: countRes.data ?? 0,
      };
    },
  });

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booth?"
    );
    if (!confirmed) return;

    try {
      await deleteBooth(id);
      toast.success("Booth deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete booth");
    }
  };

  return (
    <CrudPageWrapper
      title="Booth Management"
      search={search}
      onSearchChange={setSearch}
      createButton={
        <CreateDialogForm
          title="Add Booth"
          description="Create new booth entry"
          triggerText="Add Booth"
          schema={boothSchema}
          defaultValues={{
            boothName: "",
            locationId: "",
            description: "",
            status: true,
          }}
          onSubmit={async (values) => {
            await AxiosAPI.post("/api/Booth", {
              ...values,
              locationId: Number(values.locationId),
            });
            refetch();
          }}
          fields={[
            { type: "text", name: "boothName", label: "Booth Name" },
            {
              type: "select",
              name: "locationId",
              label: "Location",
              options: locations.map((l) => ({
                label: l.locationName,
                value: l.id,
              })),
            },
            { type: "text", name: "description", label: "Description" },
            {
              type: "switch",
              name: "status",
              label: "Status",
              description: "Enable or disable this booth",
            },
          ]}
        />
      }
      data={data}
      columns={columns(handleDelete, refetch)}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
