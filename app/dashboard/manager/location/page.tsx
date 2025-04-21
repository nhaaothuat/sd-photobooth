"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { columns } from "./columns";
import { Location } from "@/types/type";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";

const CreateDialogForm = dynamic(
  () =>
    import("@/components/layouts/CreateDialog").then(
      (mod) => mod.MemoizedCreateDialogForm
    ),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false,
  }
);

const CrudPageWrapper = dynamic(
  () =>
    import("@/components/layouts/SharedPage").then(
      (mod) => mod.MemoizedCrudPage
    ),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false,
  }
);

const locationSchema = z.object({
  locationName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
});

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
        <CreateDialogForm
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
