import ChartCard from '@/components/component/ChartCard'
import DashboardCard from '@/components/component/DashboardCard'
import Title from '@/components/component/Title'
import { useSession } from 'next-auth/react'
import React from 'react'

const AdminPage = () => {
  const { data: session } = useSession();

  if (session?.userInfo === "staff") {
    return (
      <>
      <Title title="Dashboard" />
 
      <DashboardCard />
 
      <ChartCard />
    </>
   )
  }
  return <p>You are not authorized to view this page!</p>;
  
}

export default AdminPage
