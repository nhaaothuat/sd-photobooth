import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";
import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

const Staff = () => {
  const t = useTranslations("HomePage");
  // const { data: session } = useSession();
  // if (session?.user?.role === "Staff") {
    return (
      <>
        <h1>{t("Dashboard")}</h1>
        <Title title={"Dashboard"} />

        <DashboardCard />

        <ChartCard />
      </>
    );
  // }

};

export default Staff;
