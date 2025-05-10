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
import { Label } from "@/components/ui/label";

import AxiosAPI from "@/configs/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GPOrderProps {
  orderId: number;
  initialStatus?: number;  // Cho phép undefined
  onUpdateSuccess: () => void;
}

const orderStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Chờ xác nhận", color: "gray" },
  1: { label: "Đang xử lý", color: "yellow" },
  2: { label: "Đang giao hàng", color: "blue" },
  3: { label: "Hoàn thành", color: "green" },
  4: { label: "Đã hủy", color: "red" },
};

const GPOrder: React.FC<GPOrderProps> = ({ orderId, initialStatus = 0, onUpdateSuccess }) => {
  const [status, setStatus] = useState<number>(initialStatus ?? 0); // Đặt giá trị mặc định
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {toast} = useToast();
  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus ?? 0);
    }
  }, [isOpen, initialStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.put(`/api/Order/${orderId}`, { orderId, status });
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      setIsOpen(false);
      onUpdateSuccess();
    } catch (error) {
      console.error("Update Error:", error);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Upload /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>Chọn trạng thái mới và nhấn lưu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Trạng thái</Label>
              <Select 
                value={status !== null && status !== undefined ? status.toString() : "0"} 
                onValueChange={(value) => setStatus(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(orderStatusMap).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default GPOrder;
