"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select, TextInput, Skeleton } from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import { Card, CardContent, CardHeader } from "../ui/card";

interface PersonalRevenueData {
  year: number | null;
  month: number | null;
  quarter: number | null;
  day: string | null;
  name: string;
  id: string;
  totalRevenue: number;
  count: number;
}

interface PersonalRevenueResponse {
  data: PersonalRevenueData[];
}

const parseToTimestamp = (item: PersonalRevenueData, staticType: number): number => {
  if (staticType === 0 && item.day) {
    return new Date(item.day).getTime();
  } else if (staticType === 1 && item.month !== null && item.year !== null) {
    return new Date(item.year, item.month - 1).getTime();
  } else if (staticType === 2 && item.quarter !== null && item.year !== null) {
    return new Date(item.year, (item.quarter - 1) * 3).getTime();
  } else if (staticType === 3 && item.year !== null) {
    return new Date(item.year, 0).getTime();
  }
  return 0;
};

const formatLabel = (item: PersonalRevenueData, staticType: number) => {
  switch (staticType) {
    case 0:
      return item.day ? new Date(item.day).toLocaleDateString("vi-VN") : "";
    case 1:
      return item.month !== null && item.year !== null ? `${item.month}/${item.year}` : "";
    case 2:
      return item.quarter !== null && item.year !== null ? `Q${item.quarter}/${item.year}` : "";
    case 3:
      return item.year !== null ? `${item.year}` : "";
    default:
      return "";
  }
};

const PersonalRevenueStaffChart = () => {
  const [staticType, setStaticType] = useState(0);
  const [staffId, setStaffId] = useState("");
  const [data, setData] = useState<PersonalRevenueData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      if (!staffId.trim()) {
        setData([]);
        return;
      }
      setLoading(true);
      try {
        const response = await AxiosAPI.get<PersonalRevenueResponse>(
          "/api/Dashboard/statictis-revenue-own",
          {
            params: {
              staticType,
              staffId: staffId || undefined,
            },
            signal: controller.signal,
          }
        );
        setData(response.data?.data || []);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [staticType, staffId]);

  const groupedData = useMemo(() => {
    const grouped = data.reduce<Record<string, any>>((acc, item) => {
      const label = formatLabel(item, staticType);
      if (!acc[label]) {
        acc[label] = {
          label,
          _timestamp: parseToTimestamp(item, staticType),
        };
      }
      acc[label][item.name] = item.totalRevenue;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a._timestamp - b._timestamp);
  }, [data, staticType]);

  const allNames = useMemo(() => Array.from(new Set(data.map((d) => d.name))), [data]);

  return (
   <Card className="p-6 rounded-2xl bg-white shadow-md border border-gray-200">
  <CardHeader className="mb-6 p-0">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <TextInput
          placeholder="Nhập ID nhân viên"
          value={staffId}
          onChange={(e) => setStaffId(e.currentTarget.value)}
          className="sm:w-56 w-full"
          size="md"
          radius="lg"
          variant="filled"
        />
        <Select
          value={staticType.toString()}
          onChange={(value) => setStaticType(Number(value))}
          data={[
             { value: "0", label: "Day" },
              { value: "1", label: "Month" },
              { value: "2", label: "Quarter" },
              { value: "3", label: "Year" },
          ]}
          placeholder="Chọn thời gian"
          className="sm:w-44 w-full"
          size="md"
          radius="lg"
          variant="filled"
        />
      </div>
    </div>
  </CardHeader>

  <CardContent className="pt-4">
    {!staffId.trim() ? (
      <div className="flex items-center justify-center h-64 text-gray-400 text-base">
       Please enter employee ID to view data
      </div>
    ) : loading ? (
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    ) : groupedData.length === 0 ? (
      <div className="flex items-center justify-center h-64 text-gray-400 text-base">
        Không có dữ liệu
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={groupedData} barCategoryGap={30}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            labelStyle={{ fontWeight: 500, color: "#111" }}
          />
          {allNames.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              fill={`hsl(${(index * 60) % 360}, 65%, 55%)`}
              name={name}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )}
  </CardContent>
</Card>

  );
};

export default PersonalRevenueStaffChart;
