import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface BoothForm {
  locationId: number;
  boothName: string;
  description: string;
  status: boolean;
}

const AddBooth: React.FC = () => {
  const [formData, setFormData] = useState<BoothForm>({
    locationId: 0,
    boothName: "",
    description: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<{ id: number; locationName: string }[]>([]);

  // Fetch danh sách location từ API
  useEffect(() => {
    AxiosAPI.get("api/Location")
      .then((res) => setLocations(res.data as { id: number; locationName: string }[])) // Ép kiểu
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value as string | number, // Ép kiểu
    }));
  }, []);

  const handleSelectLocation = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      locationId: Number(value), // Chuyển đổi thành số
    }));
  }, []);

  const handleToggle = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.post("api/Booth", formData);
      toast.success("Thêm gian hàng thành công!");
    } catch (error) {
      console.error("Create Error:", error);
      toast.error("Thêm gian hàng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-none border-none max-h-[450px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Thêm gian hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="locationId">Chọn địa điểm</Label>
            <Select onValueChange={handleSelectLocation} value={String(formData.locationId)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booth Name & Description */}
          {["boothName", "description"].map((field) => (
            <div key={field} className="flex flex-col space-y-1.5">
              <Label htmlFor={field}>{field === "boothName" ? "Tên gian hàng" : "Mô tả"}</Label>
              <Input
                id={field}
                placeholder={`Nhập ${field === "boothName" ? "tên gian hàng" : "mô tả"}`}
                value={formData[field as keyof BoothForm] as string} // Ép kiểu string
                onChange={handleChange}
                required
                type="text"
              />
            </div>
          ))}

          {/* Status Toggle */}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Trạng thái</p>
              <p className="text-sm text-muted-foreground">Bật hoặc tắt gian hàng.</p>
            </div>
            <Switch id="status" checked={formData.status} onCheckedChange={handleToggle} />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang lưu..." : "Lưu gian hàng"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBooth;
