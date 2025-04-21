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
import { FrameStyle } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";
import ViewDetailFrameStyle from "@/components/component/IDFrameStyle";
import UpdateFrameStyle from "@/components/component/GPFrameStyle";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<FrameStyle>[] => [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },

  {
    accessorKey: "imageUrl",
    header: "Preview",
    cell: ({ row }) => (
      <Image
        src={row.getValue("imageUrl")}
        alt="Frame"
        width={80}
        height={80}
        className="rounded-md"
      />
    ),
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return <UpdateFrameStyle id={id} onUpdated={refetchData} />;
    },
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
      const framestyle = row.original;
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
              <ViewDetailFrameStyle id={id} />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              {/* <UpdateFrame id={id}  onUpdated={refetchData} /> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
