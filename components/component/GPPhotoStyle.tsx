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

interface GPPhotoStyleProps {
  id: number;
  photoStyleData?: { name: string; description: string; imageUrl: string,promt:string,negativePrompt:string };
  onUpdateSuccess: () => void;
}

const GPPhotoStyle: React.FC<GPPhotoStyleProps> = ({ id, photoStyleData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(photoStyleData || { name: "", description: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && photoStyleData) {
      setFormData(photoStyleData);
    }
  }, [isOpen, photoStyleData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.put(`api/PhotoStyle/${id}`, formData);
      toast.success("Cập nhật kiểu ảnh thành công!");
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
          <DialogTitle>Chỉnh sửa kiểu ảnh</DialogTitle>
          <DialogDescription>Cập nhật thông tin và nhấn lưu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Tên kiểu ảnh</Label>
              <Input id="name" placeholder="Nhập tên" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <Input id="description" placeholder="Nhập mô tả" value={formData.description} onChange={handleChange} required />
            </div>
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="promt">Promt</Label>
              <Input id="promt" placeholder="Nhập mô tả" value={formData.} onChange={handleChange} required />
            </div> */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="imageUrl">URL hình ảnh</Label>
              <Input id="imageUrl" placeholder="Nhập URL hình ảnh" value={formData.imageUrl} onChange={handleChange} required />
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

export default GPPhotoStyle;