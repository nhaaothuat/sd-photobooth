"use client";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

import { TypeSession, TypeSessionProduct } from "@/types/type";
import { Card, Group, SimpleGrid, Text } from "@mantine/core";
const ByTypeSessionProduct = () => {
  const [type, setType] = useState<TypeSession[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [typep, setTypep] = useState<TypeSessionProduct[]>([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await AxiosAPI.get<TypeSession[]>("/api/TypeSession");
        setType(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sticker style:", error);
      }
    };

    fetchStyles();
  }, []);

  useEffect(() => {
    const fetchStickersByStyle = async () => {
      if (!selectedStyleId) return;
      try {
        const response = await AxiosAPI.get<TypeSessionProduct[]>(
          `/api/TypeSessionProduct/GetByTypeSessionId/${selectedStyleId}`
        );
        setTypep(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy sticker theo style:", error);
      }
    };

    fetchStickersByStyle();
  }, [selectedStyleId]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <label className="block mb-2 font-medium">Chọn Sticker Style:</label>
      <select
        className="w-full border border-gray-300 rounded p-2 mb-4"
        onChange={(e) => setSelectedStyleId(parseInt(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>
          -- Chọn một style --
        </option>
        {type.length > 0 ? (
          type.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Không có dữ liệu
          </option>
        )}
      </select>
      <SimpleGrid cols={4} spacing="sm" verticalSpacing="lg">
        {typep.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.id}</Text>
                <Text fw={500}>{item.name}</Text>
                <Text fw={500}>{item.productId}</Text>
                <Text fw={500}>{item.couponId}</Text>
                <Text fw={500}>{item.typeSessionId}</Text>
              </Group>

              <Text size="xs" c="gray">
                Tạo lúc: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Card>
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default ByTypeSessionProduct;
