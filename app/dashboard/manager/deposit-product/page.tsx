"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { DepositProduct } from "@/types/type";
import AxiosAPI from "@/configs/axios";
import { columns } from "./columns";
import AddDepositProduct from "@/components/component/AddDepositProduct";
import ExportButton from "@/components/component/ButtonExport";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { getDepositProduct } from "@/services/deposit-product";

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

export default function DepositProductPage() {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } =
    usePaginatedQuery<DepositProduct>({
      queryKey: "deposit-products",
      pageIndex,
      pageSize,
      queryFn: async ({ page, size }) => {
        return await getDepositProduct(page, size);
      },
    });

  return (
    <CrudPageWrapper
      isSearchable={false}
      title="Deposit Product Management"
      createButton={<AddDepositProduct onSuccess={refetch} />}
      rightSlot={<ExportButton />}
      data={data}
      columns={columns(refetch)}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
