"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoIosAddCircleOutline } from "react-icons/io";

import AxiosAPI from "@/configs/axios";
import { useToast } from "@/hooks/use-toast";

const frameStyleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image file is required"),
});

type FrameStyleFormData = z.infer<typeof frameStyleSchema>;

const AddFrameStyle = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FrameStyleFormData>({
    resolver: zodResolver(frameStyleSchema),
  });

  const onSubmit = async (data: FrameStyleFormData) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Description", data.description);
    formData.append("Image", data.image);

    try {
      setLoading(true);
      await AxiosAPI.post("/api/FrameStyle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
     
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: err?.response?.data?.message || "Error while adding frame style", // Thay thế t("errorDesc")
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IoIosAddCircleOutline />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Frame Style</DialogTitle>
          <DialogDescription>
            Upload frame style info and image
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("image", file);
                }}
              />
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Frame Style"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFrameStyle;
