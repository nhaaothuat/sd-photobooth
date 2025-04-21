import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types/type";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "paymentId",
    header: "Payment ID",
    cell: ({ row }) => <div>{row.getValue("paymentId")}</div>,
  },
  {
    accessorKey: "paymentMethodName",
    header: "Payment Method Name",
    cell: ({ row }) => <div>{row.getValue("paymentMethodName")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <div>{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => <div>{row.getValue("orderId")}</div>,
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
];
