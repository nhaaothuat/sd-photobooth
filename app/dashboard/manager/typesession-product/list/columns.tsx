import { ColumnDef } from "@tanstack/react-table"
import { TypeSessionProduct } from "@/types/type"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuCheckboxItem,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeletePayment from "@/components/component/DeletePayment"
import ViewDetailBooth from "@/components/component/IDBooth"
import ViewDetailTypeSessionProduct from "@/components/component/IDTypeSessionProduct"
import UpdateTypeSessionProduct from "@/components/component/GPTypeSessionProduct"


const DateCell = ({ value }: { value: string }) => {
     const date = new Date(value)
     return <div>{date.toLocaleDateString()}</div>
}

export const columns = (
     onDelete: (id: number) => Promise<void>,
     refetchData: () => void,
): ColumnDef<TypeSessionProduct>[] => [
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
               accessorKey: "productId",
               header: "Product",
               cell: ({ row }) => <div>{row.getValue("productId")}</div>,
          },
          {
               accessorKey: "levelMembershipId",
               header: "Level Membership ID",
               cell: ({ row }) => <div>{row.getValue("levelMembershipId")}</div>,
          },
          {
               accessorKey: "typeSessionId",
               header: "TypeSession ID",
               cell: ({ row }) => <div>{row.getValue("typeSessionId")}</div>,
          },
          {
               accessorKey: "couponId",
               header: "Coupon ID",
               cell: ({ row }) => <div>{row.getValue("couponId")}</div>,
          },


          {
               accessorKey: "createdAt",
               header: "Created At",
               cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
          },
          {
               id: "edit",
               header: () => <div className="text-center">Edit</div>,
               cell: ({ row }) => {
                 const id = row.original.id;
                 return (
                   <UpdateTypeSessionProduct id={id} onUpdateSuccess={refetchData} />
                 )
               }
             },
          {
               id: "actions",
               enableHiding: false,
               cell: ({ row }) => {
                    const id = row.original.id
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
                                  
                                   <DropdownMenuSeparator />
                                   <DropdownMenuItem asChild>
                                        <DeletePayment id={id} onDelete={onDelete} />
                                   </DropdownMenuItem>


                                   {/* <DropdownMenuSeparator /> */}

                                   {/* <DropdownMenuSeparator /> */}

                                   <DropdownMenuItem asChild>
                                        <ViewDetailTypeSessionProduct id={id} />
                                   </DropdownMenuItem>

                              </DropdownMenuContent>
                         </DropdownMenu>
                    );
               }
          }


     ]