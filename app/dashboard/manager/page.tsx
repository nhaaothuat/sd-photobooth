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
    // <>
    //   <DashboardCard />
    //   <StaffRevenueChart />  
    //   <ChartCard />
    //   <Component />
    //   <PersonalRevenueStaffChart />
    //   <PersonalRevenueChart />
    // </>

    <Container size="xl" py="xl" px={{ base: 'sm', md: 'xl' }}>
  
    <Box mb="xl">
      <DashboardCard />
    </Box>
  
    
    <Grid gutter={{ base: 'md', md: 'xl' }} mb="xl">
      <Grid.Col span={{ base: 12, md: 10 }}>
        <Paper 
          withBorder 
          shadow="sm" 
          p="lg"
          radius="md"
          style={{ height: '100%' }}
        >
          
          <StaffRevenueChart />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper 
          withBorder 
          shadow="sm" 
          p="lg"
          radius="md"
          style={{ height: '100%' }}
        >
         
          <Component />
        </Paper>
      </Grid.Col>
    </Grid>
  
    {/* Detailed Metrics - Middle Row */}
    <Grid gutter={{ base: 'md', md: 'xl' }} mb="xl">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper 
          withBorder 
          shadow="sm" 
          p="lg"
          radius="md"
          style={{ height: '100%' }}
        >
        
          <ChartCard />
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper 
          withBorder 
          shadow="sm" 
          p="lg"
          radius="md"
          style={{ height: '100%' }}
        >
          
          <PersonalRevenueStaffChart />
        </Paper>
      </Grid.Col>
    </Grid>
  
    {/* Full-width Bottom Section */}
    <Grid>
      <Grid.Col span={12}>
        <Paper 
          withBorder 
          shadow="sm" 
          p="lg"
          radius="md"
        >
          
          <PersonalRevenueChart />
        </Paper>
      </Grid.Col>
    </Grid>
  </Container>
  );
};

export default ManagerPage;
