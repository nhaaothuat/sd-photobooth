import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import AxiosAPI from "@/configs/axios";

const DeleteCoupon: React.FC = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const deleteCoupon = async () => {
    if (!code) {
      toast.error("Vui lòng nhập mã giảm giá cần xóa");
      return;
    }
    setLoading(true);
    try {
      await AxiosAPI.delete(`api/Coupon/${code}`);
      toast.success("Xóa mã giảm giá thành công");
      setCode("");
    } catch (err) {
      toast.error("Không thể xóa mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Input
        placeholder="Nhập mã giảm giá cần xóa"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={deleteCoupon} disabled={loading} className="bg-red-500 hover:bg-red-600">
        {loading ? "Đang xóa..." : "Xóa mã giảm giá"}
      </Button>
    </div>
  );
};

export default DeleteCoupon;
