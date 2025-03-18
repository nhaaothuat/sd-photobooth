import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const couponSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max length is 100 characters"),
  description: z.string().min(1, "Des is required").max(500, "Max length is 500 characters").optional(),
  code: z.string().min(1, "Code is required").max(50, "Max length is 50 characters"),
  discount: z.coerce.number().min(1, "Discount must be at least 1"),
  discountPercent: z.coerce.number().min(0, "Minimum is 0").max(1, "Maximum is 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxUse: z.coerce.number().min(1, "Must be at least 1").optional(),
  usedAmount: z.coerce.number().default(0),
  maxDiscount: z.coerce.number().min(0, "Minimum is 0").optional(),
  minOrder: z.coerce.number().min(0, "Minimum is 0").optional(),
  isActive: z.boolean(),
});

const AddCoupon: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    mode:"onChange",
    defaultValues: {
      name: "",
      description: "",
      code: "",
      discount: 0,
      discountPercent: 0,
      startDate: "",
      endDate: "",
      maxUse: 0,
      usedAmount: 0,
      maxDiscount: 0,
      minOrder: 0,
      isActive: true,
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.post("api/Coupon", data);
      toast.success("Thêm mã giảm giá thành công!");
      reset();
    } catch (error) {
      console.error("Create Error:", error);
      toast.error("Thêm mã giảm giá thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-none border-none max-h-[450px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Thêm mã giảm giá</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(couponSchema.shape).map((field) => (
            <div key={field} className="flex flex-col space-y-1.5">
              <Label htmlFor={field}>{field}</Label>
              <Input
                id={field}
                placeholder={`Nhập ${field}`}
                {...register(field as keyof typeof couponSchema.shape, {
                  valueAsNumber: field.includes("discount") || field.includes("max") || field.includes("min") || field.includes("used"),
                  onChange: (e) => {
                    if (e.target.type === "number" && Number(e.target.value) < 0) {
                      e.target.value = "0";
                    }
                  },
                })}
                type={
                  field.includes("discount") || field.includes("max") || field.includes("min") || field.includes("used")
                    ? "number"
                    : field.includes("Date")
                    ? "date"
                    : "text"
                }
              />
              {errors[field as keyof typeof errors ] && <p className="text-red-500 text-sm">{errors[field as keyof typeof errors]?.message as string}</p>}
            </div>
          ))}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Trạng thái</p>
              <p className="text-sm text-muted-foreground">Bật hoặc tắt mã giảm giá.</p>
            </div>
            <Switch {...register("isActive")} checked={watch("isActive")} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang lưu..." : "Lưu mã giảm giá"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCoupon;
