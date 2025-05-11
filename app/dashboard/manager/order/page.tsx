"use client";

import { columns } from "./columns";

import { useEffect, useState } from "react";
import { z } from "zod";
import AxiosAPI from "@/configs/axios";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Order, PaymentMethod, TypeSession } from "@/types/type";
import { deleteOrder, getOrderList } from "@/services/order";
import PaymentDialog from "@/components/layouts/PaymentDialog";
import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";

import { PlusCircleIcon } from "lucide-react";
import CashOrderDialog from "@/components/component/CashOrderDialog";
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

const orderSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  typeSessionId: z.coerce.number().min(0, "Session type is required"),
  paymentMethodId: z.coerce.number().min(1, "Payment method is required"),
  couponCode: z.string().optional(),
});

export default function OrderPage() {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [typeSessions, setTypeSessions] = useState<TypeSession[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cashOrderInfo, setCashOrderInfo] = useState<any | null>(null);
  const [isCashDialogOpen, setIsCashDialogOpen] = useState(false);
  const { toast } = useToast();
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
    queryFn: async ({ page, size, search }) => {
      return await getOrderList(page, size, search);
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success",
        // title: t("successTitle"),
        // description: t("successDesc"),
      })
      if (data?.length === 1 && pageIndex > 0) setPageIndex((prev) => prev - 1);
      else refetch();
    } catch {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
        variant: "destructive",
        // title: t("errorTitle"),
        // description: t("errorDesc"),

      })
    }
  };

  return (
    <>
      <CrudPageWrapper
        title="Order Management"
        isSearchable={false}
        createButton={


          <CreateDialogForm

            title="Add Order"
            description="Create a new order entry"
            triggerText=""
            triggerIcon={<PlusCircleIcon className="w-10 h-10" />}
            schema={orderSchema}
            onSubmit={async (values) => {
              try {
                const response = await AxiosAPI.post("api/Order/dashboard", values);
                const data = response.data as OrderResponse;

                if (!data?.paymentLink && !data?.code) {
                  toast({
                    className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4",
                    variant: "destructive",
                    title: "Invalid coupon response",
                    description: "Coupon code is invalid or no response data is available.",
                  });
                  throw new Error("Invalid coupon response");
                }

                const selectedMethod = paymentMethods.find(
                  (m) => m.id === values.paymentMethodId
                );
                const methodName = selectedMethod?.methodName.toLowerCase();

                if (methodName === "banking" && data.paymentLink) {
                  setPaymentLink(data.paymentLink);
                  setIsDialogOpen(true);
                  refetch();
                  return;
                }

                if (methodName === "cash" && data.code) {
                  const sessionRes = await AxiosAPI.post(`/api/Session/${data.code}`, {});
                  setCashOrderInfo({
                    orderCode: data.code,
                    sessionInfo: sessionRes.data,
                  });
                  setIsCashDialogOpen(true);
                  refetch();
                  return;
                }

                toast({
                  className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4",
                  variant: "destructive",
                  title: "Error",
                  // description: error.response?.data?.message || "Something went wrong",
                });
                throw new Error("Unhandled server response");

              } catch (error: any) {
              
                toast({
                  className: "top-0 right-0 fixed md:max-w-[420px] md:top-4 md:right-4",
                  variant: "destructive",
                  title: "Error",
                  description:
                    error?.response?.data?.message ||
                    (error instanceof Error ? error.message : "Unknown error"),
                });

                throw error;


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
                name: "couponCode",
                label: "Coupon Code",
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
      {cashOrderInfo && (
        <CashOrderDialog
          open={isCashDialogOpen}
          onClose={() => setIsCashDialogOpen(false)}
          orderCode={cashOrderInfo.orderCode}
          sessionInfo={cashOrderInfo.sessionInfo}
        />
      )}
    </>
  );
}
