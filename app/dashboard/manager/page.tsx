"use client";
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import PersonalRevenueChart from "@/components/component/LineCommon";

import { Component } from "@/components/component/LineComponent";
import PersonalRevenueStaffChart from "@/components/component/PersonalRevenueStaffChart";
import StaffRevenueChart from "@/components/component/StaffRevenueChart";

const ManagerPage = () => {
  return (
    <>
      <DashboardCard />
      <StaffRevenueChart />
      <ChartCard />
      <Component />
      <PersonalRevenueStaffChart />
      <PersonalRevenueChart />
    </>
  );
};

export default ManagerPage;
