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

interface TypeSessionDetails {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  isPrinting: boolean;
  ableTakenNumber: number;
}

interface IDTypeSessionProps {
  id: number;
}

const IDTypeSession: React.FC<IDTypeSessionProps> = ({ id }) => {
  const [data, setData] = useState<TypeSessionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await AxiosAPI.get<TypeSessionDetails>(`/api/TypeSession/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching session:", err);
      toast.error("Failed to fetch session details");
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
          <DialogTitle>Type Session Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Duration:</strong> {data.duration} minutes</p>
            <p><strong>Price:</strong> ${data.price}</p>
            <p><strong>Printing:</strong> {data.isPrinting ? "Enabled ✅" : "Disabled ❌"}</p>
            <p><strong>Max Participants:</strong> {data.ableTakenNumber}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDTypeSession;
