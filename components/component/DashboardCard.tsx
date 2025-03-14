import {
     IconArrowDownRight,
     IconArrowUpRight,
     IconDiscount2,
     IconReceipt2,
     IconUserPlus,
} from "@tabler/icons-react";
import { Paper, Group, SimpleGrid, Text, Select } from "@mantine/core";
import { useEffect, useState } from "react";

import AxiosAPI from "@/configs/axios";

const icons = {
     user: IconUserPlus,
     revenue: IconReceipt2,
     order: IconDiscount2,
};

interface DashboardData {
     totalOrderStatic: { totalOrder: number; totalOrderPrev: number };
     totalUserStatic: { totalUser: number; totalUserPrev: number };
     totalRevenueStatic: { totalRevenue: number; totalRevenuePrev: number };
}

const DashboardCard = () => {
     const [loading, setLoading] = useState(true);
     const [filter, setFilter] = useState(2);
     const [data, setData] = useState<DashboardData | null>(null);

     const fetchData = async () => {
          setLoading(true);
          try {
               const response = await AxiosAPI.post("api/Dashboard", filter);

               console.log("API Response:", response.data);
               setData(response.data as any);
          } catch (error) {
               console.error("Error fetching dashboard data:", error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          console.log("Sending data to API:", filter);
          fetchData();
     }, [filter]);

     if (loading || !data) return <Text>Loading...</Text>;

     const stats = [
          {
               title: "Total Orders",
               icon: "order",
               value: data.totalOrderStatic.totalOrder,
               diff:
                    data.totalOrderStatic.totalOrderPrev > 0
                         ? ((data.totalOrderStatic.totalOrder - data.totalOrderStatic.totalOrderPrev) /
                              data.totalOrderStatic.totalOrderPrev) *
                         100
                         : 100,
          },
          {
               title: "Total Users",
               icon: "user",
               value: data.totalUserStatic.totalUser,
               diff:
                    data.totalUserStatic.totalUserPrev > 0
                         ? ((data.totalUserStatic.totalUser - data.totalUserStatic.totalUserPrev) /
                              data.totalUserStatic.totalUserPrev) *
                         100
                         : 100,
          },
          {
               title: "Total Revenue",
               icon: "revenue",
               value: data.totalRevenueStatic.totalRevenue,
               diff:
                    data.totalRevenueStatic.totalRevenuePrev > 0
                         ? ((data.totalRevenueStatic.totalRevenue - data.totalRevenueStatic.totalRevenuePrev) /
                              data.totalRevenueStatic.totalRevenuePrev) *
                         100
                         : 100,
          },
     ];

     return (
          <div className="pb-2">
               <Select
                    value={filter.toString()}
                    onChange={(value) => setFilter(Number(value))}
                    data={[
                         { value: "0", label: "Ngày" },
                         { value: "1", label: "Tuần" },
                         { value: "2", label: "Tháng" },
                         { value: "3", label: "Năm" },
                    ]}
                    className="mb-4"
               />
               <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} className="gap-6">
                    {stats.map((stat) => {
                         const Icon = icons[stat.icon as keyof typeof icons];
                         const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

                         return (
                              <Paper
                                   withBorder
                                   p="md"
                                   radius="md"
                                   key={stat.title}
                                   className="border rounded-md p-4 shadow-md bg-white dark:bg-gray-900"
                              >
                                   <Group justify="space-between">
                                        <Text size="xs" className="text-xs text-gray-500 font-bold uppercase">
                                             {stat.title}
                                        </Text>
                                        <Icon className="text-gray-500 dark:text-gray-400" size={22} stroke={1.5} />
                                   </Group>

                                   <Group align="flex-end" gap="xs" mt={25} className="flex items-end gap-2 mt-6">
                                        <Text className="text-2xl font-bold">{stat.value}</Text>
                                        <Text
                                             className={`text-sm font-medium flex items-center ${
                                                  stat.diff > 0 ? "text-teal-500" : "text-red-500"
                                             }`}
                                        >
                                             <span>{stat.diff.toFixed(2)}%</span>
                                             <DiffIcon size={16} stroke={1.5} className="ml-1" />
                                        </Text>
                                   </Group>

                                   <Text fz="xs" className="text-xs text-gray-500 mt-2">
                                        Compared to previous period
                                   </Text>
                              </Paper>
                         );
                    })}
               </SimpleGrid>
          </div>
     );
};

export default DashboardCard;