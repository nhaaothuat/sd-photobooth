"use client";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconDiscount2,
  IconReceipt2,
  IconUserPlus,
  IconWallet,
} from "@tabler/icons-react";
import { Paper, Group, SimpleGrid, Text, Select, Badge, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

const icons = {
  user: IconUserPlus,
  revenue: IconReceipt2,
  order: IconDiscount2,
  deposit: IconWallet,
};

type DashboardData = [
  { totalOrder: number; totalOrderPrev: number },
  { totalUser: number; totalUserPrev: number },
  { totalRevenue: number; totalRevenuePrev: number },
  { totalDeposit: number; totalDepositPrev: number }
];

const calculateDiff = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const DashboardCard = () => {
  const [loading, setLoading] = useState(true);
  const [staticType, setStaticType] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { params: { staticType } };
      console.log("staticType", staticType);
      const [order, user, revenue, deposit] = await Promise.all([
        AxiosAPI.get("/api/Dashboard/statictis-order", config),
        AxiosAPI.get("/api/Dashboard/statictis-user", config),
        AxiosAPI.get("/api/Dashboard/statictis-revenue", config),
        AxiosAPI.get("/api/Dashboard/statictis-deposit", config),
      ]) as [
        { data: { totalOrder: number; totalOrderPrev: number } },
        { data: { totalUser: number; totalUserPrev: number } },
        { data: { totalRevenue: number; totalRevenuePrev: number } },
        { data: { totalDeposit: number; totalDepositPrev: number } }
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
  }, [staticType]);

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
      title: "Total Deposit",
      icon: "deposit",
      value: data[3].totalDeposit,
      diff: calculateDiff(data[3].totalDeposit, data[3].totalDepositPrev),
    },
  ];

  return (
   <div className="pb-4 space-y-6">
  <Select
    value={staticType !== null ? staticType.toString() : null}
    onChange={(value) => {
      if (value !== null && !isNaN(Number(value))) {
        setStaticType(Number(value));
      }
    }}
    data={[
      { value: "0", label: "Ngày" },
      { value: "1", label: "Tháng" },
      { value: "2", label: "Quý" },
      { value: "3", label: "Năm" },
    ]}
    className="max-w-xs"
    placeholder="Chọn thời gian"
    radius="md"
    size="md"
    styles={{
      input: {
        borderColor: "#e5e5ea",
        backgroundColor: "#f9f9fa",
        fontSize: 14,
      },
    }}
  />

  <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
    {stats.map((stat, index) => {
      const Icon = icons[stat.icon as keyof typeof icons];
      const DiffIcon = stat.diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

      return (
        <Paper
          withBorder
          radius="xl"
          p="lg"
          key={index}
          className="bg-white dark:bg-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition duration-300"
        >
          <Group justify="space-between" mb="sm">
            <Text
              size="xs"
              className="text-neutral-500 font-medium tracking-wide uppercase"
            >
              {stat.title}
            </Text>
            <Icon size={20} className="text-neutral-400" />
          </Group>

          <Group align="flex-end" gap="xs" mt="md">
            <Text className="text-2xl font-semibold text-neutral-800 dark:text-white">
              {stat.icon === "revenue"
                ? stat.value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",

                    currencyDisplay: "code",
                  })
                : stat.value}
            </Text>
            
          </Group>
        </Paper>
      );
    })}
  </SimpleGrid>
</div>

  );
};

export default DashboardCard;
