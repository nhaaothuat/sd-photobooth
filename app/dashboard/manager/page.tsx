"use client";
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";
import { useTranslations } from "next-intl";

import { useSession } from "next-auth/react";
const ManagerPage = () => {
  return (
    <>
      <Title title={"Dashboard"} />

      <DashboardCard />

      <ChartCard />
    </>
  );
};

export default ManagerPage;
