"use client";
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
} as const;

type DashboardStat = {
    total: number;
    totalPrev: number;
};

type DashboardData = {
    order: DashboardStat;
    user: DashboardStat;
    revenue: DashboardStat;
};

const DashboardCard = () => {
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState(2);
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [order, user, revenue] = await Promise.all([
                    AxiosAPI.post("https://sdphotobooth.azurewebsites.net/api/Dashboard/statictis-order", dateFilter),
                    AxiosAPI.post("https://sdphotobooth.azurewebsites.net/api/Dashboard/statictis-user", dateFilter),
                    AxiosAPI.post("https://sdphotobooth.azurewebsites.net/api/Dashboard/statictis-revenue", dateFilter),
                ]);

                setData({
                    order: order.data as unknown as DashboardStat,
                    user: user.data as unknown as DashboardStat,
                    revenue: revenue.data as unknown as DashboardStat,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateFilter]);

    if (loading || !data) return <Text>Loading...</Text>;

    const stats = [
        { title: "Total Orders", key: "order" },
        { title: "Total Users", key: "user" },
        { title: "Total Revenue", key: "revenue" },
    ] as const;

    return (
        <div className="pb-2">
            <Select
                value={dateFilter.toString()}
                onChange={(value) => setDateFilter(Number(value))}
                data={[
                    { value: "0", label: "Ngày" },
                    { value: "1", label: "Tuần" },
                    { value: "2", label: "Tháng" },
                    { value: "3", label: "Năm" },
                ]}
                className="mb-4"
            />

            <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} className="gap-6">
                {stats.map(({ title, key }) => {
                    const { total, totalPrev } = data[key];
                    const diff = totalPrev > 0 ? ((total - totalPrev) / totalPrev) * 100 : total === 0 ? 0 : 100;
                    const Icon = icons[key];
                    const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;

                    return (
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            key={key}
                            className="border rounded-md p-4 shadow-md bg-white dark:bg-gray-900"
                        >
                            <Group justify="space-between">
                                <Text size="xs" className="text-xs text-gray-500 font-bold uppercase">
                                    {title}
                                </Text>
                                <Icon className="text-gray-500 dark:text-gray-400" size={22} stroke={1.5} />
                            </Group>

                            <Group align="flex-end" gap="xs" mt={25} className="flex items-end gap-2 mt-6">
                                <Text className="text-2xl font-bold">{total}</Text>
                                <Text
                                    className={`text-sm font-medium flex items-center ${
                                        diff > 0 ? "text-teal-500" : "text-red-500"
                                    }`}
                                >
                                    <span>{diff.toFixed(2)}%</span>
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
