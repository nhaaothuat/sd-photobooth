"use client";

import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";
import { TypeSession, TypeSessionProduct } from "@/types/type";
import { Card, Group, SimpleGrid, Text } from "@mantine/core";

const ByCoupon = () => {
  const [typeSessions, setTypeSessions] = useState<TypeSession[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [result, setResult] = useState<TypeSessionProduct[]>([]);

  useEffect(() => {
    const fetchTypeSessions = async () => {
      try {
        const response = await AxiosAPI.get<TypeSession[]>("/api/TypeSession");
        setTypeSessions(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách TypeSession:", error);
      }
    };

    fetchTypeSessions();
  }, []);

  const handleFetch = async () => {
    if (!couponCode || !selectedTypeId) return;
    try {
      const response = await AxiosAPI.get<TypeSessionProduct[]>(
        `/api/TypeSessionProduct/coupon?coupon=${couponCode}&typeSessionId=${selectedTypeId}`
      );
      setResult(response.data || []);
    } catch (error) {
      console.error(
        "Lỗi khi lấy dữ liệu TypeSessionProduct theo coupon và typeSessionId:",
        error
      );
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <div>
        <label className="block mb-2 font-medium">Mã Coupon:</label>
        <input
          type="text"
          placeholder="Nhập mã coupon..."
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Chọn Type Session:</label>
        <select
          className="w-full border border-gray-300 rounded p-2 mb-4"
          onChange={(e) => setSelectedTypeId(parseInt(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>
            -- Chọn một TypeSession --
          </option>
          {typeSessions.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleFetch}
      >
        Tìm kiếm
      </button>

      {result.length > 0 && (
        <SimpleGrid cols={3} spacing="md" mt={20}>
          {result.map((item) => (
            <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>ID: {item.id}</Text>
                <Text fw={500}>{item.name}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Product ID: {item.productId}
              </Text>
              <Text size="sm" c="dimmed">
                Coupon ID: {item.couponId}
              </Text>
              <Text size="sm" c="dimmed">
                TypeSession ID: {item.typeSessionId}
              </Text>
              <Text size="xs" c="gray" mt="sm">
                Tạo lúc: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};

export default ByCoupon;
