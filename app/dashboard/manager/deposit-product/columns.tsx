import { ColumnDef } from "@tanstack/react-table"
import { DepositProduct } from "@/types/type"
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


const StatusCell = ({ value }: { value: boolean }) => (
  <div className="capitalize">{value ? "Active" : "Inactive"}</div>
)

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value)
  return <div>{date.toLocaleDateString()}</div>
}

export const columns: ColumnDef<DepositProduct>[] = [
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
     accessorKey: "description",
     header: "Description",
     cell: ({ row }) => <div>{row.getValue("description")}</div>,
   },
   {
     accessorKey: "price",
     header: "Price",
     cell: ({ row }) => <div>{row.getValue("price")}</div>,
   },
   {
     accessorKey: "amountAdd",
     header: "Amount",
     cell: ({ row }) => <div>{row.getValue("amountAdd")}</div>,
   },
   {
     accessorKey: "productId",
     header: "Product",
     cell: ({ row }) => <div>{row.getValue("productId")}</div>,
   },
  
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
    },
   
   
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id
        const booth = row.original
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booth.id.toString())}>
                Copy booth ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* <DropdownMenuItem asChild>
                <DeletePayment id={id} onDelete={onDelete} />
              </DropdownMenuItem> */}

              {/* <DropdownMenuItem asChild>
                <ViewDetailCoupon id={id} />
              </DropdownMenuItem> */}

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]