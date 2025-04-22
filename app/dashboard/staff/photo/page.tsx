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

  const handlePhotoHistorys = async () => {
    if (!inputId.trim()) {
      setError("Please enter a valid ID");
      return;
    }

    const id = parseInt(inputId);
    if (isNaN(id)) {
      setError("ID invalid");
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
      console.error("Error cannot find out Photo History via ID", error);
      setError("No Photo History found for this ID");
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
          placeholder="Enter ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePhotoHistorys()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handlePhotoHistorys}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : stickers.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">List Photo History</h2>
          <SimpleGrid cols={6} spacing="lg" verticalSpacing="sm">
            {stickers.map((sticker) => (
              <div key={`${sticker.id}`} className="flex flex-col items-center">
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
        <p className="text-gray-500">No Photo History found!</p>
      ) : null}
    </div>
  );
};

export default ByPhotoHistory;
