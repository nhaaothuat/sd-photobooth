import { ColumnDef } from "@tanstack/react-table";
import { Coupon } from "@/types/type";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeletePayment from "@/components/component/DeletePayment";
import ViewDetailCoupon from "@/components/component/IDCoupon";
import UpdateCoupon from "@/components/component/GPCoupon";
const StatusCell = ({ value }: { value: boolean }) => {
  const text = value ? "Active" : "Inactive";
  const colorClass = value ? "text-green-600" : "text-gray-400";

  return <div className={`capitalize font-medium ${colorClass}`}>{text}</div>;
};

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Coupon>[] => [
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => <div>{row.getValue("discount")}</div>,
  },
  {
    accessorKey: "startDate",
    header: "startDate",
    cell: ({ row }) => <DateCell value={row.getValue("startDate")} />,
  },
  {
    accessorKey: "endDate",
    header: "endDate",
    cell: ({ row }) => <DateCell value={row.getValue("endDate")} />,
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) => <StatusCell value={row.getValue("isActive")} />,
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
      return <UpdateCoupon couponId={id} onUpdateSuccess={refetchData} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const booth = row.original;
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
           
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeletePayment id={id} onDelete={onDelete} />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <ViewDetailCoupon id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
