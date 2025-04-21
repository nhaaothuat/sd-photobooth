"use client";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

import { Location, Booth } from "@/types/type";
import { Badge, Card, Group, SimpleGrid, Text } from "@mantine/core";
const ByLocation = () => {
  const [location, setLocation] = useState<Location[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [booth, setBooth] = useState<Booth[]>([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await AxiosAPI.get<Location[]>("/api/Location");
        setLocation(response.data || []);
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
        const response = await AxiosAPI.get<Booth[]>(
          `/api/Booth/by-location/${selectedStyleId}`
        );
        setBooth(response.data || []);
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
        {location.length > 0 ? (
          location.map((style) => (
            <option key={style.id} value={style.id}>
              {style.locationName}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Không có dữ liệu
          </option>
        )}
      </select>
      <SimpleGrid cols={4} spacing="sm" verticalSpacing="lg">
        {booth.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.boothName}</Text>
                <Badge color={item.status ? "green" : "red"}>
                  {item.status ? "Hoạt động" : "Không hoạt động"}
                </Badge>
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

export default ByLocation;
