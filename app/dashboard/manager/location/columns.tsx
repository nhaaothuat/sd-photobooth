import { ColumnDef } from "@tanstack/react-table"
import { Location } from "@/types/type"
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
import ViewDetailLocation from "@/components/component/IDLocation"
import UpdateLocation from "@/components/component/GPLocation"

const StatusCell = ({ value }: { value: boolean }) => (
  <div className="capitalize">{value ? "Active" : "Inactive"}</div>
)

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value)
  return <div>{date.toLocaleDateString()}</div>
}

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void,
): ColumnDef<Location>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "locationName",
      header: "Location Name",
      cell: ({ row }) => <div>{row.getValue("locationName")}</div>,
    },
    {
     accessorKey: "address",
     header: "Address",
     cell: ({ row }) => <div>{row.getValue("address")}</div>,
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
          <UpdateLocation id={id} onUpdateSuccess={refetchData} />
        )
      }
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

              <DropdownMenuItem asChild>
                <DeletePayment id={id} onDelete={onDelete} />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <ViewDetailLocation id={id} />
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]