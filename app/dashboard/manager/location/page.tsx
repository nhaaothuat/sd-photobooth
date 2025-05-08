"use client";

import { toast } from "sonner"
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { columns } from "./columns";
import { Location } from "@/types/type";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { deleteLocation, getLocationList } from "@/services/location";
import { PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

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
  locationName: z
    .string()
    .min(1, "Location Name is required / Tên địa điểm là bắt buộc")
    .max(100, "Location Name cannot exceed 100 characters / Tên địa điểm không được vượt quá 100 ký tự"),
  address: z
    .string()
    .min(1, "Address is required / Địa chỉ là bắt buộc")
    .max(200, "Address cannot exceed 200 characters / Địa chỉ không được vượt quá 200 ký tự"),
});

export default function LocationPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { toast } = useToast();
  const t = useTranslations("toast");
  const a = useTranslations("manager");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Location>({
    queryKey: "locations",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      return await getLocationList(page, size, search);
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteLocation(id);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: t("successTitle"),
        description: t("successDesc"),
      })
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorDesc"),

      })
    }
  };

  return (
    <CrudPageWrapper
      title={a("ma")}
      search={search}
      onSearchChange={setSearch}
      createButton={
        <CreateDialogForm
          title={a("add")}
          
          triggerText=""
          triggerIcon={<PlusCircleIcon className="w-10 h-10" />}
          schema={locationSchema}
          onSubmit={async (values) => {
            await AxiosAPI.post("/api/Location", values);
            toast({
              className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
              title: t("successTitle"),
             
              description: t("errorDesc"),
      
            })
            refetch();
          }}
          fields={[
            { type: "text", name: "locationName", label: a("locationName") },
            { type: "text", name: "address", label: a("address") },
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
