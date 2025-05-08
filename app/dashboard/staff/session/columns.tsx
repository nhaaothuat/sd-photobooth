import { ColumnDef } from "@tanstack/react-table";
import { Session } from "@/types/type";

import ViewDetailSession from "@/components/component/IDSession";
import { Group } from "@mantine/core";
import { useTranslations } from "next-intl";



const StatusCell = ({ value }: { value: boolean }) => (
  <div className="capitalize">{value ? "Active" : "Inactive"}</div>
);

const DateCell = ({ value }: { value: string | null }) => {
  if (!value) return <div>-</div>;

  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (t: ReturnType<typeof useTranslations>): ColumnDef<Session>[] => {
  
  return [
    {
      accessorKey: "id",
      header: () => <div className="text-center">{t("ID")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "code",
      header: () => <div className="text-center">{t("Code")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "expired",
      header: () => <div className="text-center">{t("Expired")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <DateCell value={row.getValue("expired")} />
        </div>
      ),
    },
    {
      accessorKey: "orderId",
      header: () => <div className="text-center">{t("OrderID")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("orderId")}</div>,
    },
    {
      accessorKey: "ableTakenNumber",
      header: () => <div className="text-center">{t("AbleTakenNumber")} </div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("ableTakenNumber")}</div>,
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-center">{t("IsActive")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <StatusCell value={row.getValue("isActive")} />
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">{t("CreatedAt")}</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <DateCell value={row.getValue("createdAt")} />
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (


        <Group justify="center">
          <ViewDetailSession id={row.original.id} />
        </Group>


      ),
    },


  ]
}