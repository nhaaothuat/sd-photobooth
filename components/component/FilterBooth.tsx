import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";

interface Location {
  id: number;
  locationName: string;
}

interface Booth {
  id: number;
  boothName: string;
  description: string;
  status: boolean;
}

const FilterBooth: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách locations
  useEffect(() => {
    AxiosAPI.get("api/Location")
      .then((res) => setLocations(res.data as Location[]))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Fetch booths theo locationId
  const fetchBooths = useCallback((locationId: string) => {
    setLoading(true);
    AxiosAPI.get(`api/Booth/filter?locationId=${locationId}`)
      .then((res) => setBooths(res.data as Booth[]))
      .catch((err) => {
        console.error("Error fetching booths:", err);
        toast.error("Không thể tải danh sách gian hàng!");
      })
      .finally(() => setLoading(false));
  }, []);

  // Xử lý chọn location
  const handleSelectLocation = (value: string) => {
    setSelectedLocation(value);
    fetchBooths(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Select Location */}
      <Select onValueChange={handleSelectLocation} value={selectedLocation}>
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

      {/* Hiển thị danh sách Booth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-lg" />
            ))
          : booths.length > 0
          ? booths.map((booth) => (
              <Card key={booth.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{booth.boothName}</CardTitle>
                </CardHeader>
                <CardContent>
                <p>{booth.id}</p>
                  <p>{booth.description}</p>
                  <p className={`text-sm ${booth.status ? "text-green-600" : "text-red-600"}`}>
                    {booth.status ? "Hoạt động" : "Không hoạt động"}
                  </p>
                </CardContent>
              </Card>
            ))
          : selectedLocation && <p className="text-center text-gray-500">Không có gian hàng nào.</p>}
      </div>
    </div>
  );
};

export default FilterBooth;
