"use client";
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";

import { useTranslations } from "next-intl";


const ManagerPage = () => {

  return (
    <>


      <DashboardCard />

      <ChartCard />
    </>
  );

};

export default ManagerPage;
