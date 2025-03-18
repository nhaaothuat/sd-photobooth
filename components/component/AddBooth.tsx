import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const boothSchema = z.object({
  boothName: z.string().min(1, "Tên gian hàng là bắt buộc").max(100, "Tên gian hàng tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
  status: z.boolean(),
});

interface BoothForm {
  locationId: number;
}

const AddBooth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<{ id: number; locationName: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BoothForm & z.infer<typeof boothSchema>>({
    resolver: zodResolver(boothSchema),
    mode:"onChange",
    defaultValues: {
      locationId: 0,
      boothName: "",
      description: "",
      status: true,
    },
  });

  // Fetch danh sách location từ API
  useEffect(() => {
    AxiosAPI.get("api/Location")
      .then((res) => setLocations(res.data as { id: number; locationName: string }[])) // Ép kiểu
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleSelectLocation = useCallback((value: string) => {
    setValue("locationId", Number(value));
  }, [setValue]);

  const handleToggle = useCallback((checked: boolean) => {
    setValue("status", checked);
  }, [setValue]);

  const onSubmit = async (data: BoothForm & z.infer<typeof boothSchema>) => {
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.post("api/Booth", data);
      toast.success("Thêm gian hàng thành công!");
    } catch (error) {
      console.error("Create Error:", error);
      toast.error("Thêm gian hàng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-none border-none max-h-[450px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Thêm gian hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Select Location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="locationId">Chọn địa điểm</Label>
            <Select onValueChange={handleSelectLocation} value={String(watch("locationId"))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booth Name & Description */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="boothName">Tên gian hàng</Label>
            <Input id="boothName" placeholder="Nhập tên gian hàng" {...register("boothName")} />
            {errors.boothName && <p className="text-red-500 text-sm">{errors.boothName.message}</p>}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" placeholder="Nhập mô tả" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Trạng thái</p>
              <p className="text-sm text-muted-foreground">Bật hoặc tắt gian hàng.</p>
            </div>
            <Switch id="status" checked={watch("status")} onCheckedChange={handleToggle} />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang lưu..." : "Lưu gian hàng"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBooth;
