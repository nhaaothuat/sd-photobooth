import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

const UpdateCoupon: React.FC = () => {
  const [id, setId] = useState("");
  const [couponData, setCouponData] = useState({
    name: "",
    description: "",
    discount: 0,
    discountPercent: 0,
    startDate: "",
    endDate: "",
    maxUse: 0,
    maxDiscount: 0,
    minOrder: 0,
    isActive: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setCouponData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateCoupon = async () => {
    if (!id) {
      toast.error("Vui lòng nhập ID mã giảm giá");
      return;
    }

    setLoading(true);
    try {
      await AxiosAPI.put(`api/Coupon/${id}`, couponData);
      toast.success("Cập nhật mã giảm giá thành công!");
    } catch (err) {
      toast.error("Không thể cập nhật mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card className="shadow-none border p-4">
        <CardHeader>
          <CardTitle>Cập nhật mã giảm giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Nhập ID mã giảm giá"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <Input
            placeholder="Tên mã giảm giá"
            name="name"
            value={couponData.name}
            onChange={handleChange}
          />

          <Input
            placeholder="Mô tả"
            name="description"
            value={couponData.description}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Giảm giá (VNĐ)"
            name="discount"
            value={couponData.discount}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Phần trăm giảm giá (%)"
            name="discountPercent"
            value={couponData.discountPercent}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="endDate"
            value={couponData.endDate}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Số lần sử dụng tối đa"
            name="maxUse"
            value={couponData.maxUse}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Giảm giá tối đa (VNĐ)"
            name="maxDiscount"
            value={couponData.maxDiscount}
            onChange={handleChange}
          />

          <Input
            type="number"
            placeholder="Đơn hàng tối thiểu (VNĐ)"
            name="minOrder"
            value={couponData.minOrder}
            onChange={handleChange}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={couponData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive">Hoạt động</label>
          </div>

          <Button onClick={updateCoupon} disabled={loading} className="bg-blue-500 hover:bg-blue-600">
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCoupon;
