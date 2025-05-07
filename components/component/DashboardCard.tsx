"use client";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconDiscount2,
  IconReceipt2,
  IconUserPlus,
  IconWallet, // New icon for deposit
} from "@tabler/icons-react";
import { Paper, Group, SimpleGrid, Text, Select, Badge, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

const icons = {
  user: IconUserPlus,
  revenue: IconReceipt2,
  order: IconDiscount2,
  deposit: IconWallet, // New icon for deposit
};

type DashboardData = [
  { totalOrder: number; totalOrderPrev: number },
  { totalUser: number; totalUserPrev: number },
  { totalRevenue: number; totalRevenuePrev: number },
  { totalDeposit: number; totalDepositPrev: number } // New deposit data
];

const calculateDiff = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const DashboardCard = () => {
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { params: { dateFilter } };
      console.log("dateFilter", dateFilter);
      const [order, user, revenue, deposit] = await Promise.all([
        AxiosAPI.get("/api/Dashboard/statictis-order", config),
        AxiosAPI.get("/api/Dashboard/statictis-user", config),
        AxiosAPI.get("/api/Dashboard/statictis-revenue", config),
        AxiosAPI.get("/api/Dashboard/statictis-deposit", config), // New API for deposit
      ]) as [
        { data: { totalOrder: number; totalOrderPrev: number } },
        { data: { totalUser: number; totalUserPrev: number } },
        { data: { totalRevenue: number; totalRevenuePrev: number } },
        { data: { totalDeposit: number; totalDepositPrev: number } } // Deposit response
      ];
      console.log(order.data, user.data, revenue.data, deposit.data);
      setData([order.data, user.data, revenue.data, deposit.data]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  if (loading || !data) return <Skeleton height={130} radius="md" />;

  const stats = [
    {
      title: "Total Orders",
      icon: "order",
      value: data[0].totalOrder,
      diff: calculateDiff(data[0].totalOrder, data[0].totalOrderPrev),
    },
    {
      title: "Total Users",
      icon: "user",
      value: data[1].totalUser,
      diff: calculateDiff(data[1].totalUser, data[1].totalUserPrev),
    },
    {
      title: "Total Revenue",
      icon: "revenue",
      value: data[2].totalRevenue,
      diff: calculateDiff(data[2].totalRevenue, data[2].totalRevenuePrev),
    },
    {
      title: "Total Deposit", // New deposit stat
      icon: "deposit",
      value: data[3].totalDeposit,
      diff: calculateDiff(data[3].totalDeposit, data[3].totalDepositPrev),
    },
  ];

  return (
    <div className="pb-4">
     <Select
  value={dateFilter !== null ? dateFilter.toString() : null}
  onChange={(value) => {
    if (value !== null && !isNaN(Number(value))) {
      setDateFilter(Number(value));
    }
  }}
  data={[
    { value: "0", label: "Ngày" },
    { value: "1", label: "Tháng" },
    { value: "2", label: "Quý" },
    { value: "3", label: "Năm" },
  ]}
  className="mb-4 max-w-xs"
  placeholder="Chọn thời gian"
/>


      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {stats.map((stat, index) => {
          const Icon = icons[stat.icon as keyof typeof icons];
          const DiffIcon = stat.diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

          return (
            <Paper
              withBorder
              radius="lg"
              p="md"
              key={index}
              className="shadow-sm bg-white dark:bg-dark-800 transition hover:shadow-md"
            >
              <Group justify="space-between" mb="xs">
                <Text size="xs" className="text-gray-500 font-semibold uppercase tracking-wide">
                  {stat.title}
                </Text>
                <Icon size={22} stroke={1.5} className="text-gray-400" />
              </Group>

              <Group align="flex-end" gap="xs" mt="md">
                <Text className="text-3xl font-bold">
                  {stat.icon === "revenue" || stat.icon === "deposit"
                    ? stat.value.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    : stat.value}
                </Text>
                <Badge
                  color={stat.diff >= 0 ? "teal" : "red"}
                  variant="light"
                  size="sm"
                  className="min-w-[80px] h-[26px] flex items-center justify-center"
                >
                  {stat.diff >= 0 ? "+" : ""}
                  {stat.diff.toFixed(2)}%
                  <DiffIcon size={14} />
                </Badge>
              </Group>

             
            </Paper>
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default DashboardCard;
