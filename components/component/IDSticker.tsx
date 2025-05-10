import { useEffect, useState } from "react";
import { Sticker } from "@/types/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AxiosAPI from "@/configs/axios";

import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { Skeleton } from "@mantine/core";

const ViewDetailSticker = ({ id }: { id: number }) => {
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await AxiosAPI.get<Sticker>(`/api/Sticker/${id}`);
      setSticker(response.data);
    } catch (error) {
      console.error("Error fetching sticker details", error);
      setSticker(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchDetail();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-green-500">
          <FaEye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sticker Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        ) : sticker ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">ID:</span>
              <span>{sticker.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span>{sticker.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Style:</span>
              <span>{sticker.stickerStyleName}</span>
            </div>

            <div className="flex justify-center">
              <Image
                src={sticker.stickerUrl}
                alt="Sticker"
                width={100}
                height={100}
                className="rounded-md border"
                onError={(e) =>
                  (e.currentTarget.src = "/fallback-image.png") // fallback image
                }
              />
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Created at:</span>
              <span>{new Date(sticker.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-500 text-center">
            Unable to load sticker details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailSticker;
