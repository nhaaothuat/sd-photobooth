"use client";

import EditMembershipCard from "@/components/component/GPMembershipCard";
import ViewDetailMembershipCard from "@/components/component/IDMemberShipCard";

import { MembershipCard } from "@/types/type";
import { Group } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";


export const columns = (
  refetchData: () => void,
  t: ReturnType<typeof useTranslations>
): ColumnDef<MembershipCard>[] => {
  
  return [
  {
    accessorKey: "id",
    header: () => <div className="text-center">{t("id")}</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">{t("name")}</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">{t("description")}</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "customer.fullName",
    header: () => <div className="text-center">{t("customerName")}</div>,
    cell: ({ row }) => {
      const name = row.original.customer.fullName;
      return <div className="text-center">{name || t("noName")}</div>;
    },
  },
  {
    accessorKey: "customer.email",
    header: () => <div className="text-center">{t("customerEmail")}</div>,
    cell: ({ row }) => {
      const email = row.original.customer.email;
      return <div className="text-center">{email || t("noEmail")}</div>;
    },
  },
  {
    accessorKey: "points",
    header: () => <div className="text-center">{t("points")}</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("points")}</div>
    ),
  },

  {
    accessorKey: "levelMemberShip",
    header: () => <div className="text-center">{t("level")}</div>,
    cell: ({ row }) => {
      const name = row.original.levelMemberShip.name;
      return <div className="text-center">{name || t("noName")}</div>;
    },
  },

  {
    accessorKey: "isActive",
    header: () => <div className="text-center">{t("isActive")}</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("isActive") ? t("yes") : t("no")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center min-w-[150px]">{t("actions")}</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Group justify="center" gap="xs">
          <EditMembershipCard id={id} onUpdated={refetchData} />
          <ViewDetailMembershipCard id={id} />
        </Group>
      
    );
    },
  },

 
];
}
