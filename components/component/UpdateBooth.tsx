import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AxiosAPI from "@/configs/axios";

interface Booth {
  locationId: number | null;
  boothName: string;
  description: string;
  status: boolean;
}

interface Location {
  id: number;
  locationName: string;
}

const UpdateBooth: React.FC = () => {
  const [boothId, setBoothId] = useState<string>("");
  const [booth, setBooth] = useState<Booth | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Lấy danh sách location
  useEffect(() => {
    AxiosAPI.get("https://sdphotobooth.azurewebsites.net/api/Location")
      .then((res) => setLocations(res.data as Location[]))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Lấy thông tin gian hàng
  const fetchBooth = async () => {
    if (!boothId) {
      toast.error("Vui lòng nhập ID gian hàng");
      return;
    }
    setLoading(true);
    try {
      const response = await AxiosAPI.get<Booth>(`https://sdphotobooth.azurewebsites.net/api/Booth/${boothId}`);
      setBooth(response.data);
    } catch (err) {
      setBooth(null);
      toast.error("Không tìm thấy gian hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật
  const updateBooth = async () => {
    if (!booth) return;

    setUpdating(true);
    try {
      await AxiosAPI.put(`https://sdphotobooth.azurewebsites.net/api/Booth/${boothId}`, booth);
      toast.success("Cập nhật thành công!");
      fetchBooth(); // Refresh dữ liệu sau khi cập nhật
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Nhập ID gian hàng"
          value={boothId}
          onChange={(e) => setBoothId(e.target.value)}
        />
        <Button onClick={fetchBooth} disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </Button>
      </div>

      {booth && (
        <Card className="shadow-none border p-4">
          <CardHeader>
            <CardTitle>Cập nhật gian hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Select Location */}
            <Select
              value={booth.locationId ? booth.locationId.toString() : ""}
              onValueChange={(value) => setBooth({ ...booth, locationId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue>
                  {locations.find((loc) => loc.id === booth.locationId)?.locationName || "Chọn vị trí"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Tên gian hàng"
              value={booth.boothName}
              onChange={(e) => setBooth({ ...booth, boothName: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={booth.description}
              onChange={(e) => setBooth({ ...booth, description: e.target.value })}
            />
            <Button
              onClick={() => setBooth({ ...booth, status: !booth.status })}
              variant={booth.status ? "default" : "destructive"}
            >
              {booth.status ? "Đang hoạt động" : "Không hoạt động"}
            </Button>
            <Button onClick={updateBooth} disabled={updating} className="w-full">
              {updating ? "Đang cập nhật..." : "Lưu thay đổi"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpdateBooth;
