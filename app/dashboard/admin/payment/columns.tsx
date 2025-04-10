import DeleteSticker from "@/components/component/DeleteSticker"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PaymentMethod } from "@/types/type"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

const DateCell = ({ value }: { value: string }) => {
     const date = new Date(value)
     return <div>{date.toLocaleDateString()}</div>
}

export const columns: ColumnDef<PaymentMethod>[] = [
     {
          accessorKey: "id",
          header: () => <div className="text-center">ID</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
     },
     {
          accessorKey: "methodName",
          header: () => <div className="text-center">Method Name</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("methodName")}</div>
     },
     {
          accessorKey: "description",
          header: () => <div className="text-center">Description</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>
     },
     {
          accessorKey: "isActive",
          header: () => <div className="text-center">Is Active</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("isActive") ? "Yes" : "No"}</div>
     },
     {
          accessorKey: "isOnline",
          header: () => <div className="text-center">Is Online</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("isOnline") ? "Yes" : "No"}</div>
     },
     {
          accessorKey: "forMobile",
          header: () => <div className="text-center">For Mobile</div>,
          cell: ({ row }) => <div className="text-center">{row.getValue("forMobile") ? "Yes" : "No"}</div>
     },
     {
          accessorKey: "createdAt",
          header: () => <div className="text-center">Created At</div>,
          cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />
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