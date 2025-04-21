import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@/types/type"




const DateCell = ({ value }: { value: string }) => {
     const date = new Date(value)
     return <div>{date.toLocaleDateString()}</div>
}

export const columns = (

): ColumnDef<Payment>[] => [
          {
               accessorKey: "id",
               header: () => <div className="text-center">ID</div>,
               cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
          },
          {
               accessorKey: "code",
               header: "Code",
               cell: ({ row }) => <div>{row.getValue("code")}</div>,
          },
          {
               accessorKey: "orderId",
               header: "Order ID",
               cell: ({ row }) => <div>{row.getValue("orderId")}</div>,
          },
          {
               accessorKey: "depositId",
               header: "Deposit ID",
               cell: ({ row }) => <div>{row.getValue("depositId")}</div>,
          },
          {
               accessorKey: "paymentMethodName",
               header: "Payment Method",
               cell: ({ row }) => <div>{row.getValue("paymentMethodName")}</div>,
          },

          {
               accessorKey: "status",
               header: "Status",
               cell: ({ row }) => <div>{row.getValue("status")}</div>,
          },
          {
               accessorKey: "createdAt",
               header: "Created At",
               cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
          },


     ]