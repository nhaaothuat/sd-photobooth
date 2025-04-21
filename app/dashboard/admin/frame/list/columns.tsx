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

import Image from "next/image";
import { Frame } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";

import ViewDetailFrame from "@/components/component/IDFrame";
import UpdateFrame from "@/components/component/GPFrame";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Frame>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "frameStyleName",
    header: "Style",
    cell: ({ row }) => <div>{row.getValue("frameStyleName")}</div>,
  },
  {
    accessorKey: "slotCount",
    header: "Slots",
    cell: ({ row }) => <div>{row.getValue("slotCount")}</div>,
  },
  {
    accessorKey: "frameUrl",
    header: "Preview",
    cell: ({ row }) => (
      <Image
        src={row.getValue("frameUrl")}
        alt="Frame"
        width={80}
        height={80}
        className="rounded-md object-contain"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return <UpdateFrame id={id} onUpdated={refetchData} />;
    },
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
              <ViewDetailFrame id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
