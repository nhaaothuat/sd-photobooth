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
import { View } from "lucide-react";

interface OrderDetails {
  id: number;
  status: number;
  email: string;
  phone: string;
  createdAt: string;
  paymentMethod?: {
    methodName: string;
  };
}

interface IDOrderProps {
  id: number;
}

const orderStatusMap: Record<number, string> = {
  0: "None",
  1: "Pending",
  2: "Processing",
  3: "Completed",
  4: "Failed",
  5: "Cancelled",
};

const IDOrder: React.FC<IDOrderProps> = ({ id }) => {
  const [data, setData] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await AxiosAPI.get<OrderDetails>(`/api/Order/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchDetails()}>
      <DialogTrigger asChild>
        <Button variant="outline"><View /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-4">
            <p><strong>ID:</strong> {data.id}</p>
            <p><strong>Status:</strong> {orderStatusMap[data.status] ?? "Unknown"}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> {data.paymentMethod?.methodName ?? "N/A"}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDOrder;
