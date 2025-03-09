import React, { useState, useEffect } from "react";
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
import { BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface GPPaymentProps {
  id: number;
  paymentData?: { methodName: string; description: string; isActive: boolean }; // Lấy từ Payment
  onUpdateSuccess: () => void;
}

const GPPayment: React.FC<GPPaymentProps> = ({ id, paymentData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(paymentData || { methodName: "", description: "", isActive: true });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  
  useEffect(() => {
    if (isOpen && paymentData) {
      setFormData(paymentData);
    }
  }, [isOpen, paymentData]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  
  const handleToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  // Cập nhật phương thức thanh toán
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.put(`api/PaymentMethod/${id}`, formData);
      toast.success("Cập nhật phương thức thanh toán thành công!");
      setIsOpen(false);
      onUpdateSuccess(); // Cập nhật lại danh sách trên Payment
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phương thức thanh toán</DialogTitle>
          <DialogDescription>Cập nhật thông tin và nhấn lưu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="methodName" >
                Tên phương thức
              </Label>
              <Input id="methodName" placeholder="Nhập tên" value={formData.methodName} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description" >
                Mô tả
              </Label>
              <Input id="description" placeholder="Nhập mô tả" value={formData.description} onChange={handleChange} required />
            </div>
            {/* Status Toggle */}
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Trạng thái</p>
                <p className="text-sm text-muted-foreground">Bật hoặc tắt phương thức này.</p>
              </div>
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleToggle} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GPPayment; 