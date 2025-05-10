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
  const [staticType, setStaticType] = useState(0);
  const [data, setData] = useState<StaffRevenueData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosAPI.get<StaffRevenueResponse>(
          "/api/Dashboard/statictis-revenue-staffs",
          {
            params: { staticType },
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
  }, [staticType]);

  const formatLabel = (item: StaffRevenueData) => {
    try {
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
    } catch (err) {
      console.error("Error formatting label:", err);
      return "";
    }
  };

const allNames = Array.from(new Set(data.map((d) => d.name)));

const parseTime = (input: string): number => {
  if (!input) return 0;

  try {
    switch (staticType) {
      case 0: // Ngày (dd/mm/yyyy)
        return new Date(input).getTime();

      case 1: { // Tháng (mm/yyyy)
        const [month, year] = input.split("/").map(Number);
        return new Date(year, month - 1).getTime();
      }

      case 2: { // Quý (Q1/2025)
        const match = input.match(/^Q(\d)\/(\d{4})$/);
        if (match) {
          const quarter = parseInt(match[1]);
          const year = parseInt(match[2]);
          return new Date(year, (quarter - 1) * 3).getTime();
        }
        return 0;
      }

      case 3: // Năm (2025)
        return new Date(parseInt(input), 0).getTime();

      default:
        return 0;
    }
  } catch {
    return 0;
  }
};
const groupedMap = data.reduce<Record<string, any>>((acc, item) => {
  const label =
    staticType === 0 && item.day
      ? new Date(item.day).toLocaleDateString("vi-VN")
      : formatLabel(item);

  if (!label) return acc;

  if (!acc[label]) {
    acc[label] = {
      label,
      timestamp:
        staticType === 0 && item.day
          ? parseTime(item.day)
          : parseTime(label),
    };
    allNames.forEach((name) => {
      acc[label][name] = 0;
    });
  }

  acc[label][item.name] = item.totalRevenue;
  return acc;
}, {});

const groupedData = Object.values(groupedMap).sort(
  (a, b) => a.timestamp - b.timestamp
);

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
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
            className="w-44"
            styles={{
              input: {
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: 14,
                backgroundColor: "#f9f9fa",
                borderColor: "#e5e5ea",
              },
            }}
          />
        </div>

        {groupedData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 font-medium">Không có dữ liệu để hiển thị</div>
        ) : (
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={groupedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  style={{
                    fontSize: 12,
                    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontSize: 13,
                  }}
                  labelStyle={{
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                  itemStyle={{
                    margin: 0,
                  }}
                />
                {allNames.map((name, index) => (
                  <Line
                    key={name}
                    dataKey={name}
                    type="monotone"
                    stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
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
    </Card>

  );
};

export default StaffRevenueChart;
