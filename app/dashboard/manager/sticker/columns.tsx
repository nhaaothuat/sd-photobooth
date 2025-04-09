import DeleteSticker from "@/components/component/DeleteSticker";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sticker } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const DateCell = ({ value }: { value: string }) => {
     const date = new Date(value)
     return <div>{date.toLocaleDateString()}</div>
}

export const columns: ColumnDef<Sticker>[] = [
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
          accessorKey: "stickerStyleName",
          header: "Style",
          cell: ({ row }) => <div>{row.getValue("stickerStyleName")}</div>,
     },
     {
          accessorKey: "stickerUrl",
          header: "Image",
          cell: ({ row }) => <Image
               src={row.getValue("stickerUrl")}
               alt="Sticker"
               width={50}
               height={50}
               className="rounded-md"
          />,
     },
     {
          accessorKey: "createdAt",
          header: "Created At",
          cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
     },
     {
          accessorKey: "lastModified",
          header: "Last Modified",
          cell: ({ row }) => <DateCell value={row.getValue("lastModified")} />,
     },
     {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
               const sticker = row.original;
               return (
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                   <span className="sr-only">Open menu</span>
                                   <MoreHorizontal />
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sticker.id.toString())}>
                                   Copy Sticker ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit sticker</DropdownMenuItem>
                              <DropdownMenuItem><DeleteSticker /></DropdownMenuItem>
                         </DropdownMenuContent>
                    </DropdownMenu>
               );
          },
     },
];