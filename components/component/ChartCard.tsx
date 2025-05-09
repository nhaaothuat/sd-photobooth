"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select } from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface RevenueData {
  year: number | null;
  month: number | null;
  quarter: number | null;
  day: string | null;
  totalRevenueMobile: number;
  totalRevenueStore: number;
}

interface RevenueResponse {
  data: RevenueData[];
}

const RevenueChart = () => {
  const [staticType, setStaticType] = useState(0);
  const [data, setData] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosAPI.get<RevenueResponse>(
          "/api/Dashboard/statictis-revenue-by-platform-type",
          {
            params: { staticType },
          }
        );
        if (response.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [staticType]);

  const formatLabel = (item: RevenueData) => {
    switch (staticType) {
      case 0:
        return item.day ? new Date(item.day).toLocaleDateString("vi-VN") : "";
      case 1:
        return item.month !== null && item.year !== null
          ? `${item.month}/${item.year}`
          : "";
      case 2:
        return item.quarter !== null && item.year !== null
          ? `Q${item.quarter}/${item.year}`
          : "";
      case 3:
        return item.year !== null ? `${item.year}` : "";
      default:
        return "";
    }
  };

  const chartData = data.map((item) => ({
    label: formatLabel(item),
    mobile: item.totalRevenueMobile,
    store: item.totalRevenueStore,
  }));

  return (
    <Card className="p-6 shadow-md rounded-2xl bg-white">
      <CardTitle>Hello</CardTitle>
      <CardHeader className="mb-4">
        <div className="flex justify-between items-center">
          <Select
            value={staticType.toString()}
            onChange={(value) => setStaticType(Number(value))}
            data={[
              { value: "0", label: "Ngày" },
              { value: "1", label: "Tháng" },
              { value: "2", label: "Quý" },
              { value: "3", label: "Năm" },
            ]}
            placeholder="Chọn thời gian"
            className="w-40"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="mobile" fill="#6cace4" name="Mobile" radius={[8, 8, 0, 0]} />
            <Bar dataKey="store" fill="#90ee90" name="Store" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
