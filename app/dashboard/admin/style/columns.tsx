"use client";

import DeletePayment from "@/components/component/DeletePayment";
import EditPhotoStyle from "@/components/component/GPPhotoStyle";
import ViewDetailPhotoStyle from "@/components/component/IDPhotoStyle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PhotoStyle } from "@/types/type";
import { Group } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<PhotoStyle>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Description</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "ipAdapterScale",
      header: () => <div className="text-center">ipAdapterScale</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("ipAdapterScale")}
        </div>
      ),
    },
    {
      accessorKey: "backgroundRemover",
      header: () => <div className="text-center">Background Remover</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("backgroundRemover") ? "Yes" : "No"}
        </div>
      ),
    },

    {
      id: "actions",
      header: () => <div className="text-center min-w-[200px]">Action</div>,
      cell: ({ row }) => {
        const id = row.original.id;
        return <Group>
          <EditPhotoStyle id={id} onUpdateSuccess={refetchData} />
          <DeletePayment id={id} onDelete={onDelete} />
          <ViewDetailPhotoStyle id={id} />
        </Group>;
      },
    },

  ];
