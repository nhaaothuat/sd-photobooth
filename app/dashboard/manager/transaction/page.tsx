"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Transaction } from "@/types/type";
import { columns } from "./columns";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { getTransaction } from "@/services/transaction";

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

export default function TransactionPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading } = usePaginatedQuery<Transaction>({
    queryKey: "transactions",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size }) => {
      return await getTransaction(page, size);
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
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
