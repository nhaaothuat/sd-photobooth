import ChartCard from '@/components/component/ChartCard'
import DashboardCard from '@/components/component/DashboardCard'
import Title from '@/components/component/Title'

import { FcScatterPlot } from "react-icons/fc";
import { Folder, MessageCircle, Newspaper, User } from 'lucide-react'
import React from 'react'

const Staff = () => {
  return (
    <>
      <Title title="Dashboard" />
      <div className="flex flex-col md:flex-row justify-between gap-5 mb-5 w-full">
        <DashboardCard
        color='bg-blue-500'
          count={100}
          icon={<FcScatterPlot className="text-slate-500" size={50}  />}
          title="Posts"
        />
        <DashboardCard
          count={100}
          icon={<Folder className="text-slate-500" size={72} />}
          title="Categories"
        />
        <DashboardCard
          count={100}
          icon={<User className="text-slate-500" size={72} />}
          title="Users"
        />
        <DashboardCard
          count={100}
          icon={<MessageCircle className="text-slate-500" size={72} />}
          title="Comments"
        />
      </div>
      <ChartCard />
    </>
  )
}

export default Staff
