import { ColumnDef } from "@tanstack/react-table";
import { Session } from "@/types/type";
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
import ViewDetailSession from "@/components/component/IDSession";

const StatusCell = ({ value }: { value: boolean }) => (
  <div className="capitalize">{value ? "Active" : "Inactive"}</div>
);

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (): //   onDelete: (id: number) => Promise<void>,
//   refetchData: () => void,
ColumnDef<Session>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div>{row.getValue("code")}</div>,
  },
  {
    accessorKey: "expired",
    header: "Expired",
    cell: ({ row }) => <DateCell value={row.getValue("expired")} />,
  },
  {
    accessorKey: "orderId",
    header: "OrderID",
    cell: ({ row }) => <div>{row.getValue("orderId")}</div>,
  },
  {
    accessorKey: "isActive",
    header: "IsActive",
    cell: ({ row }) => <StatusCell value={row.getValue("isActive")} />,
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(booth.id.toString())}
            >
              Copy booth ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* <DropdownMenuItem asChild>
                <DeletePayment id={id} onDelete={onDelete} />
              </DropdownMenuItem> */}

            <DropdownMenuItem asChild>
              <ViewDetailSession id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
