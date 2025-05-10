"use client";

import { columns } from "./columns";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { TypeSessionProduct } from "@/types/type";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import {
  deleteTypeSessionProduct,
  getTypeSessionProductList,
} from "@/services/type-session-product";
import ExportButton from "@/components/component/ButtonExport";
import { useToast } from "@/hooks/use-toast";

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

export default function TypeSessionProductPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {toast} = useToast();
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } =
    usePaginatedQuery<TypeSessionProduct>({
      queryKey: "booths",
      pageIndex,
      pageSize,
      search: debouncedSearch,
      queryFn: async ({ page, size, search }) => {
        return await getTypeSessionProductList(page, size);
      },
    });

  const handleDelete = async (id: number) => {
    try {
      await deleteTypeSessionProduct(id);
      
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else  await refetch();
    } catch {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
    }
  };

  return (
    <CrudPageWrapper
      title="Type Session Product Management"
      isSearchable={false}
      onSearchChange={setSearch}
      data={data}
      columns={columns(handleDelete, refetch)}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      rightSlot={
        <ExportButton
          endpoint="/api/TypeSessionProduct/export"
          filename="TypeSessionProduct.csv"
        />
      }
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
