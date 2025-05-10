"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { DepositProduct } from "@/types/type";
import { columns } from "./columns";
import ExportButton from "@/components/component/ButtonExport";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import {
  deleteDepositProduct,
  getDepositProduct,
} from "@/services/deposit-product";

import { couponSchema } from "@/types/schema/coupon";
import AxiosAPI from "@/configs/axios";
import { DepositProductSchema } from "@/types/schema/deposit-product";
import { PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function DepositProductPage() {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const {toast} = useToast();
  const { data, totalItems, isLoading, refetch } =
    usePaginatedQuery<DepositProduct>({
      queryKey: "deposit-products",
      pageIndex,
      pageSize,
      queryFn: async ({ page, size }) => {
        return await getDepositProduct(page, size);
      },
    });

  const handleDelete = async (id: number) => {
    try {
      await deleteDepositProduct(id);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch (error) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
      console.error("Error deleting product:", error);
    }
  };

  return (
    <CrudPageWrapper
      isSearchable={false}
      title="Deposit Product Management"
      createButton={
        <CreateDialogForm
          title="Add Deposit Product"
          description="Create new deposit product entry"
          triggerText=""
          triggerIcon={<PlusCircleIcon className="w-10 h-10" />}
          schema={DepositProductSchema}
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "description", label: "Description", type: "text" },
            { name: "price", label: "Price", type: "number" },
            {
              name: "amountAdd",
              label: "Amount Add",
              type: "number",
            },
         
          ]}
          onSubmit={async (values) => {
            await AxiosAPI.post("/api/DepositProduct", values);
            refetch();
          }}
        />
      }
      rightSlot={
        <ExportButton
          endpoint="/api/DepositProduct/export"
          filename="DepositProduct.csv"
        />
      }
      data={data}
      columns={columns(handleDelete)}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
}
