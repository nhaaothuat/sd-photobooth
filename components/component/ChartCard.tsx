"use client"
import React, { useMemo } from 'react'
import {
     Card,
     CardContent,

     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { BarChart } from '@mantine/charts';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { data } from '@/providers/data'

const ChartCard = () => {
     const stableData = useMemo(() => data, [])
     return (
          <Card>
               <CardHeader>
                    <CardTitle>Charts Title</CardTitle>

               </CardHeader>
               <CardContent >
                    <BarChart


                         h={300}
                         data={stableData}
                         dataKey="month"
                         series={[
                              { name: 'Smartphones', color: 'violet.6', stackId: 'a' },
                              { name: 'Laptops', color: 'blue.6', stackId: 'b' },
                              { name: 'Tablets', color: 'teal.6', stackId: 'b' },
                         ]}

                    />



               </CardContent>

          </Card>

     )
}

export default ChartCard
