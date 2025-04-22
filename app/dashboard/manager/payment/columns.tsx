import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/types/type";
import { PaymentStatus, PaymentStatusMeta } from "@/types/enum/payment-status";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (): ColumnDef<Payment>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
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
    cell: ({ row }) => {
      const statusValue = row.getValue("status") as PaymentStatus;
      const meta = PaymentStatusMeta[statusValue];

      if (!meta) return <div className="text-gray-500">Unknown</div>;

      const Icon = meta.icon;

      return (
        <div className={`flex items-center gap-2 ${meta.colorClass}`}>
          <Icon />
          <span>{meta.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
];
