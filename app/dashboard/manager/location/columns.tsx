import { ColumnDef } from "@tanstack/react-table";
import { Location } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";
import ViewDetailLocation from "@/components/component/IDLocation";
import UpdateLocation from "@/components/component/GPLocation";
import { Group } from "@mantine/core";
import { useTranslations } from "next-intl";

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
):ColumnDef<Location>[] => {
  const t = useTranslations("manager");
 return [
    {
      accessorKey: "id",
      header: () => <div className="text-center">{t("id")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "locationName",
      header: () => <div className="text-center">{t("locationName")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("locationName")}</div>,
    },
    {
      accessorKey: "address",
      header: () => <div className="text-center">{t("address")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">{t("createdAt")}</div>,
      cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("createdAt")} /></div>,
    },


    {
      id: "actions",
      header: () => <div className="text-center">{t("actions")}</div>,
      cell: ({ row }) => (

        <Group justify="center">
          <UpdateLocation id={row.original.id} onUpdateSuccess={refetchData} />
          <ViewDetailLocation id={row.original.id} />
          <DeletePayment id={row.original.id} onDelete={onDelete} />
        </Group>
      ),
    },


  ] 
}