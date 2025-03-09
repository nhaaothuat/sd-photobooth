import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

interface LocationDetails {
  id: number;
  locationName: string;
  address: string;
  createdAt: string;
}

interface IDLocationProps {
  id: number;
}

const IDLocation: React.FC<IDLocationProps> = ({ id }) => {
  const [data, setData] = useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await AxiosAPI.get<LocationDetails>(`api/Location/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching location details:", err);
      toast.error("Failed to fetch location details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchDetails()}>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Location Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-4">
            <p><strong>Location Name:</strong> {data.locationName}</p>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDLocation;
