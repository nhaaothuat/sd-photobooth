import { ColumnDef } from "@tanstack/react-table";
import { DepositProduct } from "@/types/type";
import ViewDetailDepositProduct from "@/components/component/IDDepositProduct";
import DeleteDepositProduct from "@/components/component/DeleteDepositProduct";
import { Group } from "@mantine/core";
import DeletePayment from "@/components/component/DeletePayment";

export const columns = (
  onDelete: (id: number) => Promise<void>
): ColumnDef<DepositProduct>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "productId",
    header: "Product ID",
  },
  {
    accessorKey: "amountAdd",
    header: "Amount Add",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Group>
        <ViewDetailDepositProduct id={row.original.id} />
        <DeletePayment id={row.original.id} onDelete={onDelete} />
      </Group>
    ),
  },
];
