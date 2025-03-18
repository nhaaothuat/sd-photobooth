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

interface PhotoStyleDetails {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface IDPhotoStyleProps {
  id: number;
}

const IDPhotoStyle: React.FC<IDPhotoStyleProps> = ({ id }) => {
  const [data, setData] = useState<PhotoStyleDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await AxiosAPI.get<PhotoStyleDetails>(`https://sdphotobooth.azurewebsites.net/api/PhotoStyle/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching photo style:", err);
      toast.error("Failed to fetch photo style details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchDetails()}>
      <DialogTrigger asChild>
        <Button variant="outline">View Photo Style</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Photo Style Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(data.updatedAt).toLocaleString()}</p>
            <img src={data.imageUrl} alt={data.name} className="w-full h-auto rounded-lg shadow-md" />
          </div>
        ) : (
          <p>No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDPhotoStyle;