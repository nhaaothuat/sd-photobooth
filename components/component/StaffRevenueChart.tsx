"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Select } from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StaffRevenueData {
  year: number | null;
  month: number | null;
  quarter: number | null;
  day: string | null;
  name: string;
  id: string;
  totalRevenue: number;
  count: number;
}

interface StaffRevenueResponse {
  data: StaffRevenueData[];
}

const StaffRevenueChart = () => {
  const [groupingType, setGroupingType] = useState(0);
  const [data, setData] = useState<StaffRevenueData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosAPI.get<StaffRevenueResponse>(
          "/api/Dashboard/statictis-revenue-staffs",
          {
            params: { groupingType },
          }
        );
        console.log("API Response:", response.data);
        if (response.data?.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [groupingType]);

  const formatLabel = (item: StaffRevenueData) => {
    try {
      switch (groupingType) {
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
    } catch (err) {
      console.error("Error formatting label:", err);
      return "";
    }
  };

  // 1. Danh sách tất cả nhân viên
  const allNames = Array.from(new Set(data.map((d) => d.name)));

  // 2. Gom nhóm dữ liệu và đảm bảo mỗi nhãn có đầy đủ các nhân viên
  const groupedMap = data.reduce<Record<string, Record<string, any>>>((acc, item) => {
    const label = formatLabel(item);
    if (!label) return acc;

    if (!acc[label]) {
      acc[label] = { label };
      allNames.forEach((name) => {
        acc[label][name] = 0; // mặc định 0 nếu không có dữ liệu
      });
    }

    acc[label][item.name] = item.totalRevenue;
    return acc;
  }, {});

  // 3. Dữ liệu mảng cho biểu đồ
  const groupedData = Object.values(groupedMap);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu của nhân viên theo thời gian</CardTitle>
        <CardDescription>Hiển thị doanh thu theo các mốc thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select
            value={groupingType.toString()}
            onChange={(value) => setGroupingType(Number(value))}
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

        {groupedData.length === 0 ? (
          <div className="text-center text-muted-foreground">Không có dữ liệu để hiển thị</div>
        ) : (
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={groupedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                  }}
                />
                {allNames.map((name, index) => (
                  <Line
                    key={name}
                    dataKey={name}
                    type="monotone"
                    stroke={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={false}
                    name={name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total revenue for each staff by selected time range
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StaffRevenueChart;
