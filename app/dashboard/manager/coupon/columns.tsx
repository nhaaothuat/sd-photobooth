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
import { Group } from "@mantine/core";
import { useTranslations } from "next-intl";
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
): ColumnDef<Coupon>[] => {
  const t = useTranslations("manager");
  return [
    {
      accessorKey: "id",
      header: () => <div className="text-center">{t("id")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">{t("name")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "code",
      header: () => <div className="text-center">{t("code")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "discount",
      header: () => <div className="text-center">{t("discount")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("discount")}</div>,
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-center">{t("startDate")}</div>,
      cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("startDate")} /></div>,
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-center">{t("endDate")}</div>,
      cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("endDate")} /></div>,
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-center">{t("isActive")}</div>,
      cell: ({ row }) => <div className="text-center"><StatusCell value={row.getValue("isActive")} /></div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">{t("createdAt")}</div>,
      cell: ({ row }) => <div className="text-center"><DateCell value={row.getValue("createdAt")} /></div>,
    },



    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (

        <Group justify="center">
          <UpdateCoupon couponId={row.original.id} onUpdateSuccess={refetchData} />
          <ViewDetailCoupon id={row.original.id} />
          <DeletePayment id={row.original.id} onDelete={onDelete} />
        </Group>
      ),
    },

  ]
}
