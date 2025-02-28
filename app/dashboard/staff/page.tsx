import ChartCard from '@/components/component/ChartCard'
import DashboardCard from '@/components/component/DashboardCard'
import Title from '@/components/component/Title'

import { FcScatterPlot } from "react-icons/fc";
import { Folder, MessageCircle, Newspaper, User } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
const Staff = () => {
  const t = useTranslations('HomePage');

  const session = useSession();
  if (session?.user?.role === "staff") {
    return (
      <>
        <h1>{t('Dashboard')}</h1>
        <Title title={"Dashboard"} />

        <DashboardCard />

        <ChartCard />
      </>
    )
  }
  return <p>You are not authorized to view this page!</p>;

}

export default Staff
