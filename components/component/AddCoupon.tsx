'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";
import { DialogFooter } from "@/components/ui/dialog";

const couponSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  code: z.string().min(1, "Code is required").max(50),
  discount: z.coerce.number().min(0).optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxUse: z.coerce.number().min(1).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  minOrder: z.coerce.number().min(0).optional(),
  isActive: z.boolean().default(true),
}).superRefine((data, ctx) => {
  const hasDiscount = (data.discount ?? 0) > 0;
  const hasDiscountPercent = (data.discountPercent ?? 0) > 0;

  if (!hasDiscount && !hasDiscountPercent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phải nhập một trong hai: 'Discount' hoặc 'DiscountPercent' với giá trị lớn hơn 0",
      path: ["discount"]
    });
  }

  if (hasDiscount && hasDiscountPercent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Chỉ được nhập một trong hai: 'Discount' hoặc 'DiscountPercent'",
      path: ["discount"]
    });
  }

  if (hasDiscountPercent && data.discountPercent && (data.discountPercent < 0 || data.discountPercent > 100)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "DiscountPercent phải từ 0 đến 100",
      path: ["discountPercent"]
    });
  }
});

interface AddCouponProps {
  onAddSuccess: () => void;
}

const AddCoupon: React.FC<AddCouponProps> = ({ onAddSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
      discount: undefined,
      discountPercent: undefined,
      startDate: "",
      endDate: "",
      maxUse: undefined,
      maxDiscount: undefined,
      minOrder: undefined,
      isActive: true,
    },
  });

  const watchDiscount = watch("discount");
  const watchDiscountPercent = watch("discountPercent");

  const onSubmit = async (values: any) => {
    if (loading) return;
    setLoading(true);

    try {
      // Format data before sending
      const payload = {
        ...values,
        discount: values.discount ? Number(values.discount) : null,
        discountPercent: values.discountPercent ? Number(values.discountPercent) / 100 : null,
      };

      const response = await AxiosAPI.post("/api/Coupon", payload);
      
      if (response.status >= 200 && response.status < 300) {
        toast.success("Coupon created successfully!");
        reset();
        setIsOpen(false);
        onAddSuccess();
      } else {
        throw new Error(response.statusText);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || "Failed to create coupon";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "An error occurred");
      console.error("Create coupon error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'discount' | 'discountPercent') => {
    const value = e.target.value;
    if (value === '') {
      setValue(field, undefined);
      return;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    setValue(field, numValue as any);
    
    
    if (field === 'discount' && numValue > 0) {
      setValue('discountPercent', undefined);
    } else if (field === 'discountPercent' && numValue > 0) {
      setValue('discount', undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coupon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Coupon</DialogTitle>
          <DialogDescription>
            Create a new coupon with discount or discount percentage
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Coupon name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                {...register("code")}
                placeholder="Unique coupon code"
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Amount</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={watchDiscount ?? ''}
                  onChange={(e) => handleDiscountChange(e, 'discount')}
                  disabled={(watchDiscountPercent ?? 0) > 0}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Discount Percent</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={watchDiscountPercent ?? ''}
                  onChange={(e) => handleDiscountChange(e, 'discountPercent')}
                  disabled={(watchDiscount ?? 0) > 0}
                  placeholder="0-100%"
                />
              </div>
            </div>
            {(errors.discount || errors.discountPercent) && (
              <p className="text-red-500 text-sm">
                {errors.discount?.message || errors.discountPercent?.message}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUse">Max Uses</Label>
                <Input
                  id="maxUse"
                  type="number"
                  min="1"
                  {...register("maxUse")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  min="0"
                  {...register("maxDiscount")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min Order</Label>
                <Input
                  id="minOrder"
                  type="number"
                  min="0"
                  {...register("minOrder")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" {...register("isActive")} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoupon;