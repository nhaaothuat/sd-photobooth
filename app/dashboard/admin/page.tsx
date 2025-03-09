"use client"
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";

import React from "react";

const AdminPage = () => {
  // const { data: session } = useSession();
  // if (session?.user?.role === "Admin") {
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

export default AdminPage;
