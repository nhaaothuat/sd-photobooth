"use client";

import { User } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

const StatusCell = ({ value }: { value: boolean }) => {
  const t = useTranslations("staff");
  return <div className="capitalize">{value ? t("statusActive") : t("statusInactive")}</div>;
};

const GenderCell = ({ value }: { value: number }) => {
  const t = useTranslations("staff");
  return (
    <div className="capitalize">
      {value === 0 ? t("genderMale") : value === 1 ? t("genderFemale") : t("genderOther")}
    </div>
  );
};

const DateCell = ({ value }: { value: string | null }) => {
  if (!value) return <div>-</div>;
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (): ColumnDef<User>[] => {
  const t = useTranslations("staff");

  return [
    {
      accessorKey: "id",
      header: () => <div className="text-center min-w-[100px]">{t("id")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "fullName",
      header: () => <div className="text-center min-w-[100px]">{t("fullName")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "userName",
      header: () => <div className="text-center min-w-[200px]">{t("userName")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("userName")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center min-w-[200px]">{t("email")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-center">{t("gender")}</div>,
      cell: ({ row }) => <GenderCell value={row.getValue("gender")} />,
    },
    {
      accessorKey: "birthDate",
      header: () => <div className="text-center min-w-[100px]">{t("birthDate")}</div>,
      cell: ({ row }) => <DateCell value={row.getValue("birthDate")} />,
    },
    {
      id: "membershipLevel",
      accessorFn: (row) => row.membershipCard?.currentLevel ?? "N/A",
      header: () => <div className="text-center min-w-[100px]">{t("membershipLevel")}</div>,
      cell: ({ getValue }) => <div className="text-center">{String(getValue())}</div>,
    },
    {
      accessorKey: "isBanned",
      header: () => <div className="text-center min-w-[100px]">{t("banned")}</div>,
      cell: ({ row }) => <StatusCell value={row.getValue("isBanned")} />,
    },
  ];
};
