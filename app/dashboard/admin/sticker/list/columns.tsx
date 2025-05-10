import DeletePayment from "@/components/component/DeletePayment";
import UpdateSticker from "@/components/component/GPSticker";
import ViewDetailSticker from "@/components/component/IDSticker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sticker } from "@/types/type";
import { Group } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Sticker>[] => [
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
      accessorKey: "stickerStyleName",
      header: () => <div className="text-center">Style</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("stickerStyleName")}</div>,
    },
    {
      accessorKey: "stickerUrl",
      header: () => <div className="text-center">Image</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Image
            src={row.getValue("stickerUrl")}
            alt="Sticker"
            width={50}
            height={50}
            className="rounded-md inline-block"
          />
        </div>
      ),
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
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Group justify="center" >
            <UpdateSticker id={id} onUpdated={refetchData} />
            <DeletePayment id={id} onDelete={onDelete} />
            <ViewDetailSticker id={id} />
          </Group>
        )
      },
    },

  ];
