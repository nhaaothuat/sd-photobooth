"use client";
import React, { useState } from "react";
import AxiosAPI from "@/configs/axios";
import { Indicator, SimpleGrid } from "@mantine/core";
import Image from "next/image";
import { PhotoStyle } from "@/types/type";

const ByPhotoHistory = () => {
  const [inputId, setInputId] = useState<string>("");
  const [stickers, setStickers] = useState<PhotoStyle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchStickers = async () => {
    if (!inputId.trim()) {
      setError("Vui lòng nhập ID");
      return;
    }

    const id = parseInt(inputId);
    if (isNaN(id)) {
      setError("ID phải là số");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AxiosAPI.get<PhotoStyle[]>(
        `/api/PhotoHistory/manage/photo/${id}`
      );
      setStickers(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy sticker theo ID:", error);
      setError("Không tìm thấy dữ liệu với ID này");
      setStickers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded p-2"
          placeholder="Nhập ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetchStickers()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleFetchStickers}
          disabled={isLoading}
        >
          {isLoading ? "Đang tải..." : "Tìm kiếm"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : stickers.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Danh sách Sticker</h2>
          <SimpleGrid cols={6} spacing="lg" verticalSpacing="sm">
            {stickers.map((sticker) => (
              <div
                key={`${sticker.id}-${sticker.name}`}
                className="flex flex-col items-center"
              >
                {sticker.imageUrl ? (
                  <Indicator
                    inline
                    label={sticker.name || "No name"}
                    color="blue"
                    size={16}
                  >
                    <Image
                      alt={sticker.name || `Sticker ${sticker.id}`}
                      width={100}
                      height={100}
                      src={sticker.imageUrl}
                      className="rounded-lg"
                      onError={(e) => {
                        // Xử lý khi hình ảnh lỗi
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </Indicator>
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                    No image
                  </div>
                )}
              </div>
            ))}
          </SimpleGrid>
        </div>
      ) : inputId && !error ? (
        <p className="text-gray-500">Không có sticker nào cho ID này</p>
      ) : null}
    </div>
  );
};

export default ByPhotoHistory;
