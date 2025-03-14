import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface Booth {
  id: number;
  boothName: string;
  description: string;
  status: boolean;
  createdAt: string;
  location: {
    id: number;
    locationName: string;
    address: string;
  };
}

const GPBooth: React.FC = () => {
  const [boothId, setBoothId] = useState("");
  const [booth, setBooth] = useState<Booth | null>(null);
  const [loading, setLoading] = useState(false);

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
      toast.error("Không tìm thấy gian hàng");
    } finally {
      setLoading(false);
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
            <CardTitle>Gian hàng: {booth.boothName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>ID:</strong> {booth.id}</p>
            <p><strong>Mô tả:</strong> {booth.description}</p>
            <p><strong>Trạng thái:</strong> {booth.status ? "Hoạt động" : "Không hoạt động"}</p>
            <p><strong>Ngày tạo:</strong> {new Date(booth.createdAt).toLocaleDateString()}</p>
            <p><strong>Vị trí:</strong> {booth.location.locationName}</p>
            <p><strong>Địa chỉ:</strong> {booth.location.address}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GPBooth;
