"use client";

import { columns } from "./columns";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Order, PaymentMethod, TypeSession } from "@/types/type";
import { deleteOrder, getOrderList } from "@/services/order";
import PaymentDialog from "@/components/layouts/PaymentDialog";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";

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

const orderSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  typeSessionId: z.coerce.number().min(0, "Session type is required"),
  paymentMethodId: z.coerce.number().min(0, "Payment method is required"),
  coupon: z.string().optional(),
});

export default function OrderPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [typeSessions, setTypeSessions] = useState<TypeSession[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeSessionRes, paymentMethodRes] = await Promise.all([
          AxiosAPI.get("/api/TypeSession"),
          AxiosAPI.get("/api/PaymentMethod/all/web"),
        ]);
        setTypeSessions(typeSessionRes.data as TypeSession[]);
        setPaymentMethods(paymentMethodRes.data as PaymentMethod[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Order>({
    queryKey: "orders",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      return await getOrderList(page, size, search);
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      toast.success("Order deleted successfully");
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  return (
    <>
      <CrudPageWrapper
        title="Order Management"
        search={search}
        onSearchChange={setSearch}
        createButton={
          <CreateDialogForm
            title="Add Order"
            description="Create a new order entry"
            triggerText="Add Order"
            schema={orderSchema}
            onSubmit={async (values) => {
              try {
                const response = await AxiosAPI.post("api/Order/dashboard", {
                  ...values,
                });
                const data = response.data as unknown as OrderResponse;
                if (data.paymentLink) {
                  setPaymentLink(data.paymentLink);
                  setIsDialogOpen(true);
                } else {
                  console.error("No payment link received.");
                }
              } catch (error) {
                toast.error(
                  "Error creating order: " + error || "Unknown error"
                );
              }
            }}
            fields={[
              {
                type: "text",
                name: "email",
                label: "Email",
                placeholder: "Enter your email",
              },
              {
                type: "text",
                name: "phone",
                label: "Phone",
                placeholder: "Enter your phone number",
              },
              {
                type: "select",
                name: "typeSessionId",
                label: "Session Type",
                options: typeSessions.map((session) => ({
                  value: session.id,
                  label: session.name,
                })),
              },
              {
                type: "text",
                name: "coupon",
                label: "Coupon",
                placeholder: "Enter coupon code (optional)",
              },
              {
                type: "select",
                name: "paymentMethodId",
                label: "Payment Method",
                options: paymentMethods.map((method) => ({
                  value: method.id,
                  label: method.methodName,
                })),
              },
            ]}
          />
        }
        data={data}
        columns={columns(handleDelete, refetch)}
        isLoading={isLoading}
        pageCount={Math.ceil(totalItems / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
      <PaymentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        paymentLink={paymentLink}
      />
    </>
  );
}
