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

const CreateDialogForm = dynamic(
  () =>
    import("@/components/layouts/CreateDialog").then(
      (mod) => mod.MemoizedCreateDialogForm
    ),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const CrudPageWrapper = dynamic(
  () =>
    import("@/components/layouts/SharedPage").then(
      (mod) => mod.CrudPageWrapper
    ),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const couponSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional(),
    code: z.string().min(1, "Code is required").max(50),
    discount: z.coerce.number().min(0).optional(),
    discountPercent: z.coerce.number().min(0).max(100).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    maxUse: z.coerce.number().min(1).optional(),
    maxDiscount: z.coerce.number().min(0).optional(),
    minOrder: z.coerce.number().min(0).optional(),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const hasDiscount = (data.discount ?? 0) > 0;
    const hasDiscountPercent = (data.discountPercent ?? 0) > 0;

    if (!hasDiscount && !hasDiscountPercent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Phải nhập một trong hai: 'Discount' hoặc 'DiscountPercent' với giá trị lớn hơn 0",
        path: ["discount"],
      });
    }

    if (hasDiscount && hasDiscountPercent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Chỉ được nhập một trong hai: 'Discount' hoặc 'DiscountPercent'",
        path: ["discount"],
      });
    }

    if (
      hasDiscountPercent &&
      data.discountPercent &&
      (data.discountPercent < 0 || data.discountPercent > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DiscountPercent phải từ 0 đến 100",
        path: ["discountPercent"],
      });
    }
  });

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
      const url = search?.trim()
        ? `/api/Coupon/search/${search}`
        : "/api/Coupon";
      const res = await AxiosAPI.get<Coupon[]>(url, {
        params: { PageNumber: page, PageSize: size },
      });

      const countRes = await AxiosAPI.get<number>("/api/Coupon/count");
      return {
        items: res.data ?? [],
        totalItems: countRes.data ?? 0,
      };
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await AxiosAPI.delete(`/api/Coupon/${id}`);
      toast.success("Đã xóa mã giảm giá thành công");
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <CrudPageWrapper
      title="Danh sách mã giảm giá"
      search={search}
      onSearchChange={(val) => {
        setSearch(val);
        setPageIndex(0);
      }}
      pageSize={pageSize}
      onPageSizeChange={(val) => {
        setPageSize(val);
        setPageIndex(0);
      }}
      pageIndex={pageIndex}
      createButton={
        <CreateDialogForm
          title="Add Coupon"
          description="Create new coupon entry"
          triggerText="Add Coupon"
          schema={couponSchema as ZodType<CouponFormType>}
          fields={[
            { name: "name", label: "Tên mã", type: "text" },
            { name: "code", label: "Mã code", type: "text" },
            { name: "discountPercent", label: "% Giảm giá", type: "number" },
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
    />
  );
}
