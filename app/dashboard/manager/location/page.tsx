"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudPageWrapper } from "@/components/layouts/SharedPage";
import { CreateDialogForm } from "@/components/layouts/CreateDialog";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { columns } from "./columns";
import { Location } from "@/types/type";

const locationSchema = z.object({
  locationName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
});

type LocationFormType = z.infer<typeof locationSchema>;

export default function LocationPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Location>({
    queryKey: "locations",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      const url = search?.trim()
        ? `/api/Location/by-location/${search}`
        : `/api/Location`;
      const res = await AxiosAPI.get<Location[]>(url, {
        params: { PageNumber: page, PageSize: size },
      });

      const countRes = await AxiosAPI.get<number>("/api/Location/count");
      return {
        items: res.data ?? [],
        totalItems: countRes.data ?? 0,
      };
    },
  });

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirmed) return;

    try {
      await AxiosAPI.delete(`/api/Location/${id}`);
      toast.success("Location deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete location");
    }
  };

  return (
    <CrudPageWrapper
      title="Location Management"
      search={search}
      onSearchChange={setSearch}
      createButton={
        <CreateDialogForm<LocationFormType>
          title="Add Location"
          description="Create a new location"
          triggerText="Add Location"
          schema={locationSchema}
          defaultValues={{
            locationName: "",
            address: "",
          }}
          onSubmit={async (values) => {
            await AxiosAPI.post("/api/Location", values);
            refetch();
          }}
          fields={[
            { type: "text", name: "locationName", label: "Location Name" },
            { type: "text", name: "address", label: "Address" },
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
