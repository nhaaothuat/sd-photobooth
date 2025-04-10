"use client"
 
import DeleteSticker from "@/components/component/DeleteSticker"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LevelMembership } from "@/types/type"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

export const columns: ColumnDef<LevelMembership>[] = [
     {
          accessorKey:"id",
          header: () => <div className="text-center">ID</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>
     },
     {
          accessorKey: "name",
          header: () => <div className="text-center">Name</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>
     },
     {
          accessorKey:"description",
          header: () => <div className="text-center">Description</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>
     },
     {
          accessorKey:"point",
          header: () => <div className="text-center">Point</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("point")}</div>
     },
     {
          accessorKey:"discountPercent",
          header: () => <div className="text-center">Discount Percent</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("discountPercent")}</div>
     },
     {
          accessorKey:"maxDiscount",
          header: () => <div className="text-center">Max Discount</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("maxDiscount")}</div>
     },
     {
          accessorKey:"minOrder",
          header: () => <div className="text-center">Min Order</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("minOrder")}</div>
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
