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
import { Select, Skeleton } from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTranslations } from "next-intl";

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

const formatLabel = (item: PersonalRevenueData, staticType: number) => {
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

const PersonalRevenueChart = () => {
  const [staticType, setStaticType] = useState(0);
  const [data, setData] = useState<PersonalRevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("staff");

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AxiosAPI.get<PersonalRevenueResponse>(
          "/api/Dashboard/statictis-revenue-own",
          {
            params: { staticType },
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
  }, [staticType]);

  const groupedData = useMemo(() => {
    const grouped = data.reduce<Record<string, Record<string, any>>>((acc, item) => {
      const label = formatLabel(item, staticType);
      if (!acc[label]) {
        acc[label] = { label, _timestamp: parseToTimestamp(item, staticType) };
      }
      acc[label][item.name] = item.totalRevenue;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a._timestamp - b._timestamp);
  }, [data, staticType]);

  const allNames = useMemo(
    () => Array.from(new Set(data.map((d) => d.name))),
    [data]
  );

  return (
    <Card className="p-6 rounded-2xl bg-gray-50 shadow-sm border">
      <CardHeader className="mb-6 p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
       
          <Select
            value={staticType.toString()}
            onChange={(value) => setStaticType(Number(value))}
            data={[
              { value: "0", label: t("day") },
              { value: "1", label: t("month") },
              { value: "2", label: t("quarter") },
              { value: "3", label: t("year") },
            ]}
            placeholder={t("placeholder")}
            className="w-44"
            size="md"
            radius="md"
            variant="filled"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {loading ? (
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        ) : groupedData.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-base">
            {t("noData")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={groupedData} barCategoryGap={30}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#333" }}
              />
              {allNames.map((name, index) => (
                <Bar
                  key={name}
                  dataKey={name}
                  fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                  name={name}
                  radius={[10, 10, 0, 0]}
                  maxBarSize={50}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalRevenueChart;
