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
import { FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";
import { CiEdit } from "react-icons/ci";

interface TypeSessionDataProps {
  name: string;
  description: string;
  duration: number;
  price: number;
  isPrinting: boolean;
  ableTakenNumber: number;
}

interface GPTypeSessionProps {
  id: number;
  typeSessionData?: TypeSessionDataProps;
  onUpdateSuccess: () => void;
}

const GPTypeSession: React.FC<GPTypeSessionProps> = ({ id, typeSessionData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<TypeSessionDataProps>(
    typeSessionData || { name: "", description: "", duration: 0, price: 0, isPrinting: true, ableTakenNumber: 0 }
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (isOpen && typeSessionData) {
  //     setFormData(typeSessionData);
  //   }
  // }, [isOpen, typeSessionData]);
  useEffect(() => {
    if (isOpen && typeSessionData) {
      setFormData({
        ...typeSessionData,
        isPrinting: typeSessionData.isPrinting ?? true, // ✅ Chỉ cập nhật đúng dữ liệu
      });
    }
  }, [isOpen, typeSessionData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToggle = (checked: boolean) => {
    console.log("Giá trị isPrinting trước khi thay đổi:", formData.isPrinting);
    console.log("Giá trị isPrinting sau khi thay đổi:", checked);
  
    setFormData((prev) => ({
      ...prev,
      isPrinting: checked,
    }));
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    console.log(formData)
    try {
      const response = await AxiosAPI.put(`api/TypeSession/${id}`, formData);
      console.log(response.data)
      toast.success("Cập nhật loại phiên thành công!");
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
        <Button variant="outline"><CiEdit /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại phiên</DialogTitle>
          <DialogDescription>Cập nhật thông tin và nhấn lưu.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Tên phiên</Label>
              <Input id="name" placeholder="Nhập tên" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Mô tả</Label>
              <Input id="description" placeholder="Nhập mô tả" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="duration">Thời lượng (phút)</Label>
              <Input type="number" id="duration" value={formData.duration} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Giá</Label>
              <Input type="number" id="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ableTakenNumber">Số lượng tối đa</Label>
              <Input type="number" id="ableTakenNumber" value={formData.ableTakenNumber} onChange={handleChange} required />
            </div>

            <div className="flex items-center space-x-4 rounded-md border p-4">
              <FileText />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">In phiếu</p>
                <p className="text-sm text-muted-foreground">Bật hoặc tắt tính năng in phiếu.</p>
              </div>
              <Switch id="isPrinting" checked={formData.isPrinting ?? true} onCheckedChange={handleToggle} />

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

export default GPTypeSession;
