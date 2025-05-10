"use client";
import ChartCard from "@/components/component/ChartCard";
import DashboardCard from "@/components/component/DashboardCard";
import PersonalRevenueChart from "@/components/component/LineCommon";

import { Component } from "@/components/component/LineComponent";
import PersonalRevenueStaffChart from "@/components/component/PersonalRevenueStaffChart";
import StaffRevenueChart from "@/components/component/StaffRevenueChart";
import { Badge, Box, Container, Grid, Group, Paper, Title } from "@mantine/core";

const ManagerPage = () => {
  return (

    <Container fluid size="xl" py="xl" px={{ base: "sm", md: "xl" }}>
      {/* Tổng quan Dashboard */}
      <Box mb="xl">
        <DashboardCard />
      </Box>

      {/* Mỗi hàng là 1 biểu đồ */}
      <Box mb="xl">
        <Paper
          withBorder
          shadow="sm"
          p="lg"
          radius="md"
          className="min-w-full md:min-w-[700px]"
        >
          <Title order={3} mb="md">Employee revenue</Title>
          <StaffRevenueChart />
        </Paper>
      </Box>

      <Box mb="xl">
        <Paper
          withBorder
          shadow="sm"
          p="lg"
          radius="md"
          className="min-w-full md:min-w-[600px]"
        >
          <Title order={3} mb="md">Revenue by Business Location </Title>
          <Component />
        </Paper>
      </Box>

      <Box mb="xl">
        <Paper
          withBorder
          shadow="sm"
          p="lg"
          radius="md"
          className="min-w-full md:min-w-[600px]"
        >
          <Title order={3} mb="md">Revenue by Sales Channel</Title>
          <ChartCard />
        </Paper>
      </Box>

      <Box mb="xl">
        <Paper
          withBorder
          shadow="sm"
          p="lg"
          radius="md"
          className="min-w-full md:min-w-[600px]"
        >
          <Title order={3} mb="md">Employee Revenue Performance</Title>
          <PersonalRevenueStaffChart />
        </Paper>
      </Box>

      <Box>
        <Paper
          withBorder
          shadow="sm"
          p="lg"
          radius="md"
          className="min-w-full md:min-w-[800px]"
        >
          <Title order={3} mb="md">Account-generated Revenue</Title>
          <PersonalRevenueChart />
        </Paper>
      </Box>
    </Container>
  );
};

export default ManagerPage;
