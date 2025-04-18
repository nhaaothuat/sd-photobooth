import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

const Staff = () => {
  const t = useTranslations("HomePage");
 
    return (
      <>
        <h1>{t("Dashboard")}</h1>
        

        {/* <DashboardCard /> */}

        <ChartCard />
      </>
    );
  // }

};

export default Staff;
