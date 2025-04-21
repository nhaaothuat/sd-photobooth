"use client";

import { CrudPageWrapper } from "@/components/layouts/SharedPage";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Transaction } from "@/types/type";
import AxiosAPI from "@/configs/axios";
import { columns } from "./columns";

export default function TransactionPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } =
    usePaginatedQuery<Transaction>({
      queryKey: "transactions",
      pageIndex,
      pageSize,
      search: debouncedSearch,
      queryFn: async ({ page, size }) => {
        const res = await AxiosAPI.get<Transaction[]>(`/api/Transaction`, {
          params: { PageNumber: page, PageSize: size },
        });

        const countRes = await AxiosAPI.get<number>("/api/Transaction/count");

        return {
          items: res.data ?? [],
          totalItems: countRes.data ?? 0,
        };
      },
    });

  return (
    <CrudPageWrapper
      title="Transaction Management"
      search={search}
      onSearchChange={setSearch}
      createButton={null}
      data={data}
      columns={columns()}
      isLoading={isLoading}
      pageCount={totalItems}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
