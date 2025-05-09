"use client";

import { useEffect, useState } from "react";
import {
     BarChart,
     Bar,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     ResponsiveContainer,
} from "recharts";
import { Select, TextInput } from "@mantine/core";
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

const PersonalRevenueStaffChart = () => {
     const [groupingType, setGroupingType] = useState(0);
     const [staffId, setStaffId] = useState("");
     const [data, setData] = useState<PersonalRevenueData[]>([]);

     useEffect(() => {
          const fetchData = async () => {
               if (!staffId.trim()) {
                    setData([]);
                    return;
               }
               try {
                    const response = await AxiosAPI.get<PersonalRevenueResponse>(
                         "/api/Dashboard/statictis-revenue-own",
                         {
                              params: {
                                   groupingType,
                                   staffId: staffId || undefined, // ⬅️ Chỉ gửi nếu có
                              },
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
     }, [groupingType, staffId]);

     const formatLabel = (item: PersonalRevenueData) => {
          let label = "";
          switch (groupingType) {
               case 0:
                    label = item.day ? new Date(item.day).toLocaleDateString("vi-VN") : "";
                    break;
               case 1:
                    label = item.month !== null && item.year !== null ? `${item.month}/${item.year}` : "";
                    break;
               case 2:
                    label = item.quarter !== null && item.year !== null ? `Q${item.quarter}/${item.year}` : "";
                    break;
               case 3:
                    label = item.year !== null ? `${item.year}` : "";
                    break;
          }
          console.log("label:", label);
          return label;
     };
     
     const groupedData = Object.values(
          data.reduce<Record<string, Record<string, any>>>((acc, item) => {
               const label = formatLabel(item);
               if (!acc[label]) acc[label] = { label };
               acc[label][item.name] = item.totalRevenue;
               return acc;
          }, {})
     );

     const allNames = Array.from(new Set(data.map((d) => d.name)));

     return (
          <Card className="p-6 shadow-md rounded-2xl bg-white">
               <CardHeader className="mb-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                         <h2 className="text-xl font-semibold">Doanh thu cá nhân</h2>
                         <div className="flex gap-4 flex-col md:flex-row">
                              <TextInput
                                   placeholder="Nhập ID nhân viên"
                                   value={staffId}
                                   onChange={(e) => setStaffId(e.currentTarget.value)}
                                   className="w-40"
                              />
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
                    </div>
               </CardHeader>
               <CardContent>
                    {!staffId.trim() ? (
                         <div className="flex items-center justify-center h-64 text-gray-500">
                              Vui lòng nhập ID nhân viên để xem dữ liệu
                         </div>
                    ) : groupedData.length === 0 ? (
                         <div className="flex items-center justify-center h-64 text-gray-500">
                              Không có dữ liệu
                         </div>
                    ) : (
                         <ResponsiveContainer width="100%" height={400}>
                              <BarChart data={groupedData}>
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
                                   {allNames.map((name, index) => (
                                        <Bar
                                             key={name}
                                             dataKey={name}
                                             fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                                             name={name}
                                             radius={[8, 8, 0, 0]}
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
