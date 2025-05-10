"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
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
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";

import { FaPlus } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import handleAxiosError from "@/utils/handle-axios-error";

const levelMembershipSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  description: z.string().optional(),
  point: z.coerce.number().min(0, "Điểm phải là số không âm"),
  isActive: z.boolean(),
  discountPercent: z.coerce
    .number()
    .min(0)
    .max(100, "Phần trăm giảm giá từ 0 đến 100"),
  maxDiscount: z.coerce.number().min(0),
  minOrder: z.coerce.number().min(0),
  nextLevelId: z.coerce.number().min(0),
});

type LevelMembershipForm = z.infer<typeof levelMembershipSchema>;

const AddLevelMembership = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LevelMembershipForm>({
    resolver: zodResolver(levelMembershipSchema),
    defaultValues: {
      name: "",
      description: "",
      point: 0,
      isActive: true,
      discountPercent: 0,
      maxDiscount: 0,
      minOrder: 0,
      nextLevelId: 0,
    },
  });

  const onSubmit = async (data: LevelMembershipForm) => {
    if (loading) return;
    setLoading(true);
    try {
      await AxiosAPI.post("/api/LevelMembership", data);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {

      const { status, statusText, data } = handleAxiosError(error);
      const message = (data as { message?: string })?.message || statusText || "Đã có lỗi xảy ra";

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Lỗi",
        description: message,
      });


    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><FaPlus /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm cấp độ thành viên</DialogTitle>
          <DialogDescription>
            Nhập thông tin cấp độ thành viên và nhấn lưu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Label htmlFor="name">Tên</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div>
            <Label htmlFor="point">Điểm</Label>
            <Input
              type="number"
              min="0"
              id="point"
              {...register("point", { valueAsNumber: true })}
            />
            {errors.point && (
              <p className="text-red-500 text-sm">{errors.point.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="discountPercent">Phần trăm giảm giá (%)</Label>
            <Controller
              name="discountPercent"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  id="discountPercent"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={Input}
                  value={field.value}
                  onValueChange={(values) => field.onChange(values.floatValue)}
                />
              )}
            />
            {errors.discountPercent && (
              <p className="text-red-500 text-sm">
                {errors.discountPercent.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="maxDiscount">Giảm giá tối đa</Label>
            <Input
              type="number"
              min="0"
              id="maxDiscount"
              {...register("maxDiscount", { valueAsNumber: true })}
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-sm">
                {errors.maxDiscount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="minOrder">Đơn hàng tối thiểu</Label>
            <Input
              type="number"
              min="0"
              id="minOrder"
              {...register("minOrder", { valueAsNumber: true })}
            />
            {errors.minOrder && (
              <p className="text-red-500 text-sm">{errors.minOrder.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nextLevelId">ID cấp độ tiếp theo</Label>
            <Input
              type="number"
              min="0"
              id="nextLevelId"
              {...register("nextLevelId", { valueAsNumber: true })}
            />
            {errors.nextLevelId && (
              <p className="text-red-500 text-sm">{errors.nextLevelId.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border p-4">
            <span className="text-sm font-medium">Kích hoạt</span>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLevelMembership;
