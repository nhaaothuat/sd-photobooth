import { ColumnDef } from "@tanstack/react-table";
import { Booth } from "@/types/type";
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
import ViewDetailBooth from "@/components/component/IDBooth";
import UpdateBooth from "@/components/component/GPBooth";

const StatusCell = ({ value }: { value: boolean }) => (
  <div className="capitalize">{value ? "Active" : "Inactive"}</div>
);

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Booth>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "boothName",
      header: () => <div className="text-center">Booth Name</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("boothName")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
    },
    {
      accessorKey: "location.locationName",
      header: () => <div className="text-center">Location Name</div>,
      cell: ({ row }) => {
        const location = row.original.location;
        return <div className="text-center">{location?.locationName ?? "N/A"}</div>;
      },
    },
    {
      accessorKey: "location.address",
      header: () => <div className="text-center">Address</div>,
      cell: ({ row }) => {
        const location = row.original.location;
        return <div className="text-center">{location?.address ?? "N/A"}</div>;
      },
    },

    {
      id: "edit",
      header: () => <div className="text-center">Edit</div>,
      cell: ({ row }) => {
        const id = row.original.id;
        return <UpdateBooth id={id} onUpdateSuccess={refetchData} />;
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(booth.id.toString())}
              >
                Copy booth ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <DeletePayment id={id} onDelete={onDelete} />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <ViewDetailBooth id={id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
