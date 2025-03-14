import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface CouponForm {
  name: string;
  description: string;
  code: string;
  discount: number;
  discountPercent: number;
  startDate: string;
  endDate: string;
  maxUse: number;
  usedAmount: number;
  maxDiscount: number;
  minOrder: number;
  isActive: boolean;
}

const AddCoupon: React.FC = () => {
  const [formData, setFormData] = useState<CouponForm>({
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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    let newValue: any = value;

    if (type === "number") {
      newValue = Number(value) || 0;
      if (id === "discountPercent") {
        newValue = Math.max(0, Math.min(1, newValue)); // Ensure discountPercent is between 0 and 1
      }
    } else if (id.includes("Date") && value) {
      newValue = new Date(value).toISOString().split("T")[0]; // Format date for input field
    }

    setFormData((prev) => ({ ...prev, [id]: newValue }));
  }, []);

  const handleToggle = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.post("api/Coupon", formData);
      toast.success("Thêm mã giảm giá thành công!");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "description", "code", "discount", "discountPercent", "startDate", "endDate", "maxUse", "usedAmount", "maxDiscount", "minOrder"].map((field) => (
            <div key={field} className="flex flex-col space-y-1.5">
              <Label htmlFor={field}>{field}</Label>
              <Input
                id={field}
                placeholder={`Nhập ${field}`}
                value={formData[field as keyof CouponForm] as string | number}
                onChange={handleChange}
                required
                type={field.includes("discount") || field.includes("max") || field.includes("min") || field.includes("used") ? "number" : field.includes("Date") ? "date" : "text"}
                min={field === "discountPercent" ? 0 : undefined}
                max={field === "discountPercent" ? 1 : undefined}
                step={field === "discountPercent" ? 0.01 : undefined}
              />
            </div>
          ))}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Trạng thái</p>
              <p className="text-sm text-muted-foreground">Bật hoặc tắt mã giảm giá.</p>
            </div>
            <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleToggle} />
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