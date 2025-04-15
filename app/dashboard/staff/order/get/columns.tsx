
import * as React from "react"
import {
  ColumnDef,

} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Image from "next/image"
import { Order } from "@/types/type"
import DeletePayment from "@/components/component/DeletePayment"

import ViewDetailFrame from "@/components/component/IDFrame"
import UpdateFrame from "@/components/component/GPFrame"
import ViewDetailOrder from "@/components/component/IDOrder"

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value)
  return <div>{date.toLocaleDateString()}</div>
}

export const columns = (
  // onDelete: (id: number) => Promise<void>,
  // refetchData: () => void,
): ColumnDef<Order>[] => [
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div>{row.getValue("amount")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "sessionCode",
      header: "Session Code",
      cell: ({ row }) => <div>{row.getValue("sessionCode")}</div>,
    },
    {
      accessorKey: "couponCode",
      header: "Coupon",
      cell: ({ row }) => <div>{row.getValue("couponCode")}</div>,
    },
    {
      accessorKey: "boothName",
      header: "Booth",
      cell: ({ row }) => <div>{row.getValue("boothName")}</div>,
    },
    
    
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;
        const frame = row.original
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
                <ViewDetailOrder id={id} />
              </DropdownMenuItem>

              

            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ]
