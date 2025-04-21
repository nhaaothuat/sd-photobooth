"use client";

import { columns } from "./columns";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { z, ZodType } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Coupon } from "@/types/type";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { couponSchema } from "@/types/schema/coupon";
import { deleteCoupon, getCouponList } from "@/services/coupon";
import { get } from "lodash";

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

type CouponFormType = z.infer<typeof couponSchema>;

export default function CouponPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Coupon>({
    queryKey: "coupons",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      return await getCouponList(page, size, search);
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteCoupon(id);
      toast.success("Đã xóa mã giảm giá thành công");
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <CrudPageWrapper
      title="Coupon Management"
      search={search}
      onSearchChange={(val) => {
        setSearch(val);
        setPageIndex(0);
      }}
      createButton={
        <CreateDialogForm
          title="Add Coupon"
          description="Create new coupon entry"
          triggerText="Add Coupon"
          schema={couponSchema as ZodType<CouponFormType>}
          fields={[
            { name: "name", label: "Tên mã", type: "text" },
            { name: "code", label: "Mã code", type: "text" },
            { name: "description", label: "Mô tả", type: "text" },
            { name: "discount", label: "Giảm giá", type: "number" },
            { name: "discountPercent", label: "% Giảm giá", type: "number" },
            { name: "maxUse", label: "Số lượng tối đa", type: "number" },
            { name: "maxDiscount", label: "Giảm tối đa", type: "number" },
            { name: "minOrder", label: "Đơn hàng tối thiểu", type: "number" },
            { name: "startDate", label: "Từ ngày", type: "date" },
            { name: "endDate", label: "Đến ngày", type: "date" },
            { name: "isActive", label: "Kích hoạt", type: "switch" },
          ]}
          onSubmit={async (values) => {
            await AxiosAPI.post("/api/Coupon", values);
            refetch();
          }}
          defaultValues={{
            name: "",
            description: "",
            code: "",
            discount: undefined,
            discountPercent: undefined,
            startDate: "",
            endDate: "",
            maxUse: undefined,
            maxDiscount: undefined,
            minOrder: undefined,
            isActive: true,
          }}
        />
      }
      data={data ?? []}
      columns={columns(handleDelete, refetch)}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      onPageChange={setPageIndex}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
    />
  );
}
