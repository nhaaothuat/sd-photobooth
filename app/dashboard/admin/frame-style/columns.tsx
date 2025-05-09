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
import { Group } from "@mantine/core";

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
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Description</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-center">Preview</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Image
            src={row.getValue("imageUrl")}
            alt="Frame"
            width={80}
            height={80}
            className="rounded-md inline-block"
          />
        </div>
      ),
    },
   

    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => <div className="text-center">
        <DateCell value={row.getValue("createdAt")} />
      </div>,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const id = row.original.id;
       
        return (
          <Group>
            <DeletePayment id={id} onDelete={onDelete} />
            <ViewDetailFrameStyle id={id} />
            <UpdateFrameStyle id={id} onUpdated={refetchData} />
          </Group>


        );
      },
    },
  ];
