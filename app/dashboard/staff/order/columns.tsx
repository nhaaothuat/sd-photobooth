import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";
import ViewDetailOrder from "@/components/component/IDOrder";
import { OrderStatus, OrderStatusMeta } from "@/types/enum/order-status";

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
    header: () => <div className="flex justify-center w-full">ID</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: () => <div className="flex justify-center w-full">Code</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="flex justify-center w-full">Status</div>,
    cell: ({ row }) => {
      const statusValue = row.getValue("status") as OrderStatus;
      const meta = OrderStatusMeta[statusValue];
  
      if (!meta)
        return <div className="text-gray-500 text-center w-full">Unknown</div>;
  
      const Icon = meta.icon;
  
      return (
        <div className={`flex justify-center items-center gap-2 w-full ${meta.colorClass}`}>
          <Icon />
          <span>{meta.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="flex justify-center w-full">Amount</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="flex justify-center w-full">Email</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "sessionCode",
    header: () => <div className="flex justify-center w-full">Session Code</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("sessionCode")}</div>,
  },
  {
    accessorKey: "couponCode",
    header: () => <div className="flex justify-center w-full">Coupon</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("couponCode")}</div>,
  },
  {
    accessorKey: "boothName",
    header: () => <div className="flex justify-center w-full">Booth</div>,
    cell: ({ row }) => <div className="text-center w-full">{row.getValue("boothName")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="flex justify-center w-full">Created At</div>,
    cell: ({ row }) => (
      <div className="text-center w-full">
        <DateCell value={row.getValue("createdAt")} />
      </div>
    ),
  },
  
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const frame = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id.toString())}>
                             Copy Sticker ID
                        </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}

            <DropdownMenuItem asChild>
              <DeletePayment id={id} onDelete={onDelete} />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <ViewDetailOrder id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
