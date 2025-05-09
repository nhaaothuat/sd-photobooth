import { DeleteItem } from "@/components/component/DeleteGeneric";
import DeletePayment from "@/components/component/DeletePayment";
import UpdateStickerStyle from "@/components/component/GPStickerStyle";
import ViewDetailStickerStyle from "@/components/component/IDStickerStyle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteStickerStyle } from "@/services/sticker-style";
import { StickerStyle } from "@/types/type";
import { Group } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<StickerStyle>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "stickerStyleName",
      header: () => <div className="text-center">Sticker Style Name</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("stickerStyleName")}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Description</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <DateCell value={row.getValue("createdAt")} />
        </div>
      ),
    },
    {
      accessorKey: "lastModified",
      header: () => <div className="text-center">Last Modified</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <DateCell value={row.getValue("lastModified")} />
        </div>
      ),
    },

    {
      id: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const id = row.original.id;

        return (

          <Group>
            <DeletePayment id={id} onDelete={onDelete} />
            <UpdateStickerStyle id={id} onUpdateSuccess={refetchData} />
            <ViewDetailStickerStyle id={id} />
          </Group>

        )
      },
    },

  ];
