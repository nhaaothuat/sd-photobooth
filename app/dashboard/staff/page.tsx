import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";
import React from "react";
import { useTranslations } from "next-intl";

const Staff = () => {
  const t = useTranslations("HomePage");

  return (
    <>
      <h1>{t("Dashboard")}</h1>
      <Title title={"Dashboard"} />

      <DashboardCard />

      <ChartCard />
    </>
  );
};

export default Staff;
