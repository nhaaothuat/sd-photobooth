import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import AxiosAPI from "@/configs/axios";

interface Coupon {
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

const GPCoupon: React.FC = () => {
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchCoupon = async () => {
    if (!code) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    setLoading(true);
    try {
      const response = await AxiosAPI.get<Coupon>(`api/Coupon/${code}`);
      setCoupon(response.data);
    } catch (err) {
      setCoupon(null);
      toast.error("Không tìm thấy mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Nhập mã giảm giá"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={fetchCoupon} disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </Button>
      </div>
      {coupon && (
        <Card className="shadow-none border p-4">
          <CardHeader>
            <CardTitle>Mã giảm giá: {coupon.code}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Tên:</strong> {coupon.name}</p>
            <p><strong>Mô tả:</strong> {coupon.description}</p>
            <p><strong>Giảm giá:</strong> {coupon.discount} VND ({coupon.discountPercent * 100}%)</p>
            <p><strong>Ngày bắt đầu:</strong> {new Date(coupon.startDate).toLocaleDateString()}</p>
            <p><strong>Ngày kết thúc:</strong> {new Date(coupon.endDate).toLocaleDateString()}</p>
            <p><strong>Tối đa sử dụng:</strong> {coupon.maxUse}</p>
            <p><strong>Đã sử dụng:</strong> {coupon.usedAmount}</p>
            <p><strong>Giảm giá tối đa:</strong> {coupon.maxDiscount} VND</p>
            <p><strong>Đơn hàng tối thiểu:</strong> {coupon.minOrder} VND</p>
            <p><strong>Trạng thái:</strong> {coupon.isActive ? "Hoạt động" : "Không hoạt động"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GPCoupon;
