import { ColumnDef } from "@tanstack/react-table";
import { TypeSessionProduct } from "@/types/type";
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
import ViewDetailTypeSessionProduct from "@/components/component/IDTypeSessionProduct";
import UpdateTypeSessionProduct from "@/components/component/GPTypeSessionProduct";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<TypeSessionProduct>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "productId",
    header: () => <div className="text-center">Product</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("productId")}</div>,
  },
  {
    accessorKey: "levelMembershipId",
    header: () => <div className="text-center">Level Membership ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("levelMembershipId")}</div>,
  },
  {
    accessorKey: "typeSessionId",
    header: () => <div className="text-center">TypeSession ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("typeSessionId")}</div>,
  },
  {
    accessorKey: "couponId",
    header: () => <div className="text-center">Coupon ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("couponId")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("createdAt")} /></div>,
  },
  
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return <UpdateTypeSessionProduct id={id} onUpdateSuccess={refetchData} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
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
    },
  },
];
