import {
     IconArrowDownRight,
     IconArrowUpRight,
     IconCoin,
     IconDiscount2,
     IconReceipt2,
     IconUserPlus,
} from "@tabler/icons-react";
import { Paper, Group, SimpleGrid, Text } from "@mantine/core";
const icons = {
     user: IconUserPlus,
     discount: IconDiscount2,
     receipt: IconReceipt2,
     coin: IconCoin,
};

const data = [
     { title: "Revenue", icon: "receipt", value: "13,456", diff: 34 },
     { title: "Profit", icon: "coin", value: "4,145", diff: -13 },
     { title: "Coupons usage", icon: "discount", value: "745", diff: 18 },
     { title: "New customers", icon: "user", value: "188", diff: -30 },
] as const;

const DashboardCard = () => {
     return (
          <div className="pb-4">
               <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} className="gap-6">
                    {data.map((stat) => {
                         const Icon = icons[stat.icon];
                         const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

                         return (
                              <Paper withBorder p="md" radius="md" key={stat.title} className="border rounded-md p-4 shadow-md bg-white dark:bg-gray-900">
                                   <Group justify="space-between">
                                        <Text size="xs" className="text-xs text-gray-500 font-bold uppercase">
                                             {stat.title}
                                        </Text>
                                        <Icon className="text-gray-500 dark:text-gray-400" size={22} stroke={1.5} />
                                   </Group>

                                   <Group align="flex-end" gap="xs" mt={25} className="flex items-end gap-2 mt-6">
                                        <Text className="text-2xl font-bold">{stat.value}</Text>
                                        <Text
                                             className={`text-sm font-medium flex items-center ${stat.diff > 0 ? 'text-teal-500' : 'text-red-500'
                                                  }`}
                                        >
                                             <span>{stat.diff}%</span>
                                             <DiffIcon size={16} stroke={1.5} className="ml-1" />
                                        </Text>
                                   </Group>

                                   <Text fz="xs" className="text-xs text-gray-500 mt-2">Compared to previous month</Text>
                              </Paper>
                         );
                    })}
               </SimpleGrid>
          </div>
     );
}

export default DashboardCard