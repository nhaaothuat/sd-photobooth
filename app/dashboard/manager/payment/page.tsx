"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { columns } from "./columns";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { Payment } from "@/types/type";
import { getPaymentMethod } from "@/services/payment-method";

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

export default function PaymentMethodPage() {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Payment>({
    queryKey: "payment-methods",
    pageIndex,
    pageSize,
    queryFn: async ({ page, size }) => {
      return await getPaymentMethod(page, size);
    },
  });

  return (
    <CrudPageWrapper
      isSearchable={false}
      title="Payment Method Management"
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
