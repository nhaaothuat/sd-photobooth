"use client"

import DeleteSticker from "@/components/component/DeleteSticker"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PhotoStyle } from "@/types/type"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

export const columns: ColumnDef<PhotoStyle>[] = [
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
          accessorKey: "imageUrl",
          header: () => <div className="text-center">Image</div>,
          cell: ({ row }) => <Image
               src={row.getValue("imageUrl")}
               alt="image"
               width={50}
               height={50}
               className="rounded-md"
          />,

     },
     {
          accessorKey: "faceImage",
          header: () => <div className="text-center">Face Image</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("faceImage") ? "Yes" : "No"}</div>
     },
     {
          accessorKey:"backgroundRemover",
          header: () => <div className="text-center">Background Remover</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("backgroundRemover") ? "Yes" : "No"}</div>
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
