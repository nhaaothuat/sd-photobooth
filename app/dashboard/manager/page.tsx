"use client";
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";
import { useTranslations } from "next-intl";

import { useSession } from "next-auth/react";
const ManagerPage = () => {
     // const {data: session} = useSession();
     // if (session?.user?.role === "Manager") {
       return (
         <>
           <Title title="Dashboard" />
     
           <DashboardCard />
     
           <ChartCard />
         </>
       );
     // }
     // return <p>You are not authorized to view this page!</p>
};

export default ManagerPage;
