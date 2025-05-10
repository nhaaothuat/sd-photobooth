import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Order } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";
import ViewDetailOrder from "@/components/component/IDOrder";
import { OrderStatus, OrderStatusMeta } from "@/types/enum/order-status";
import { Group } from "@mantine/core";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Order>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "code",
      header: () => <div className="text-center">Code</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const statusValue = row.getValue("status") as OrderStatus;
        const meta = OrderStatusMeta[statusValue];

        if (!meta) return <div className="text-center text-gray-500">Unknown</div>;

        const Icon = meta.icon;

        return (
          <div className={`flex items-center gap-2 text-center ${meta.colorClass}`}>
            <Icon />
            <span>{meta.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("amount")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "sessionCode",
      header: () => <div className="text-center">Session Code</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("sessionCode")}</div>,
    },
    {
      accessorKey: "couponCode",
      header: () => <div className="text-center">Coupon</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("couponCode")}</div>,
    },
    {
      accessorKey: "boothName",
      header: () => <div className="text-center min-w-[100px]">Booth</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("boothName")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("createdAt")} /></div>,
    },

    {
      id: "actions",
     
      header: () => <div className="text-center min-w-[200px]">Actions</div>,
      cell: ({ row }) => {
        const id = row.original.id;
       

        return (
          <Group justify="center">
            <DeletePayment id={id} onDelete={onDelete} />
            <ViewDetailOrder id={id} />
          </Group>

        );
      },
    },
  ];
