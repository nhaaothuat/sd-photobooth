"use client";

import { columns } from "./columns";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { TypeSessionProduct } from "@/types/type";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import {
  deleteTypeSessionProduct,
  getTypeSessionProductList,
} from "@/services/type-session-product-service";

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this Type Session Product?"
    );
    if (!confirmed) return;

    try {
      await deleteTypeSessionProduct(id);
      toast.success("Type Session Product deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete Type Session Product");
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
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
