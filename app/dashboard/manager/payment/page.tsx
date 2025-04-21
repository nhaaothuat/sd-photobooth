"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import AxiosAPI from "@/configs/axios";
import { columns } from "./columns";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { Payment } from "@/types/type";

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

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Payment>({
    queryKey: "payment-methods",
    pageIndex,
    pageSize,
    queryFn: async ({ page, size }) => {
      const [res, countRes] = await Promise.all([
        AxiosAPI.get<Payment[]>("/api/Payment", {
          params: {
            PageNumber: page,
            PageSize: size,
          },
        }),
        AxiosAPI.get<number>("/api/Payment/count"),
      ]);

      return {
        items: res.data ?? [],
        totalItems: countRes.data ?? 0,
      };
    },
  });

  return (
    <CrudPageWrapper
      isSearchable={false}
      title="Payment Method Management"
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
