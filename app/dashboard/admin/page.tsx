"use client"
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import Title from "@/components/component/Title";

import React from "react";

const AdminPage = () => {
  
    return (
      <>
        <Title title="Dashboard" />

        <DashboardCard />

        <ChartCard />
      </>
    );
  

};

export default AdminPage;
