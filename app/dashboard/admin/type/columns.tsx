"use client"

import DeleteSticker from "@/components/component/DeleteSticker"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TypeSession } from "@/types/type"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"


const DateCell = ({ value }: { value: string }) => {
     const date = new Date(value)
     return <div>{date.toLocaleDateString()}</div>
}

export const columns: ColumnDef<TypeSession>[] = [
     {
          accessorKey: "id",
          header: () => <div className="text-center">ID</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>
     },
     {
          accessorKey: "name",
          header: () => <div className="text-center">Name</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>
     },
     {
          accessorKey: "description",
          header: () => <div className="text-center">Description</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>
     },
     {
          accessorKey: "duration",
          header: () => <div className="text-center">Duration</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("duration")}</div>
     },
     {
          accessorKey: "price",
          header: () => <div className="text-center">Price</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("price")}</div>
     },
     {
          accessorKey: "isPrinting",
          header: () => <div className="text-center">Is Printing</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("isPrinting") ? "Yes" : "No"}</div>
     },
     {
          accessorKey: "ableTakenNumber",
          header: () => <div className="text-center">Able Taken Number</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("ableTakenNumber")}</div>
     },
     {
          accessorKey: "createdAt",
          header: () => <div className="text-center">Created At</div>,
          cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />
     }
     {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
               const sticker = row.original;
               return (
                    <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">

                                   <MoreHorizontal />
                              </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="center">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sticker.id.toString())}>
                                   Copy Sticker ID
                              </DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              {/* <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit sticker</DropdownMenuItem> */}

                              <DeleteSticker />
                              {/* <DropdownMenuSeparator /> */}
                              <DeleteSticker />
                              {/* <DropdownMenuSeparator /> */}
                              <DeleteSticker />


                         </DropdownMenuContent>
                    </DropdownMenu>
               );
          }
     }
]
