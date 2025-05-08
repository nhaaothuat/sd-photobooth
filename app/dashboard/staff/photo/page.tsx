"use client";

import React, { useCallback, useState } from "react";
import AxiosAPI from "@/configs/axios";
import { SimpleGrid, Skeleton } from "@mantine/core";
import Image from "next/image";
import { PhotoHistory } from "@/types/type";
import { useTranslations } from "next-intl";

const ByPhotoHistory = () => {
  const [inputId, setInputId] = useState<string>("");
  const [photos, setPhotos] = useState<PhotoHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("staff");
  const fetchPhotoHistory = useCallback(async () => {
    if (!inputId.trim()) {
      setError("Please enter a valid ID");
      return;
    }

    const id = parseInt(inputId);
    if (isNaN(id)) {
      setError("ID must be a number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await AxiosAPI.get(`/api/PhotoHistory/manage/photo/${id}`);

      const processedData = Array.isArray(data)
        ? data.map((item, index) => ({
          ...item,
          id: item.id || `photo-${index}`,
          url: item.url?.replace(/\s+/g, ""),
        }))
        : [];

      setPhotos(processedData);
    } catch (err) {
      
      setError("No photo history found for this ID");
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, [inputId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchPhotoHistory();
    }
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <input
          type="text"
          className="w-full sm:w-auto flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t("enterUserId")}
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 shadow"
          onClick={fetchPhotoHistory}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("search")}
        </button>
      </div>



      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md border border-red-300">
          {error}
        </div>
      )}


      {isLoading && (
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      )}


      {!isLoading && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center p-3"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={photo.url}
                  alt={photo.photoStyleName}
                  fill
                  unoptimized
                  className="object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-800 font-medium text-center truncate w-full">
                {photo.photoStyleName}
              </p>
            </div>
          ))}
        </div>

      )}

     
      {!isLoading && inputId && !error && photos.length === 0 && (
        <div className="text-center text-gray-500 mt-4 text-sm">
          Không tìm thấy lịch sử ảnh nào.
        </div>
      )}
    </div>

  );
};

export default ByPhotoHistory;
