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
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface GPLocationProps {
  id: number;
  locationData?: { locationName: string; address: string };
  onUpdateSuccess: () => void;
}

const GPLocation: React.FC<GPLocationProps> = ({ id, locationData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(locationData || { locationName: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && locationData) {
      setFormData(locationData);
    }
  }, [isOpen, locationData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.put(`api/Location/${id}`, formData);
      toast.success("Cập nhật địa điểm thành công!");
      setIsOpen(false);
      onUpdateSuccess();
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
          <DialogTitle>Chỉnh sửa địa điểm</DialogTitle>
          <DialogDescription>Cập nhật thông tin và nhấn lưu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="locationName">Tên địa điểm</Label>
              <Input id="locationName" placeholder="Nhập tên địa điểm" value={formData.locationName} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" placeholder="Nhập địa chỉ" value={formData.address} onChange={handleChange} required />
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

export default GPLocation;
