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


interface PaymentMethodDetails {
  id: number;
  methodName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface IDPaymentMethodProps {
  id: number;
}

const IDPaymentMethod: React.FC<IDPaymentMethodProps> = ({ id }) => {
  const [data, setData] = useState<PaymentMethodDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await AxiosAPI.get<PaymentMethodDetails>(`/api/PaymentMethod/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching payment method:", err);
      toast.error("Failed to fetch payment method details");
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
          <DialogTitle>Payment Method Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="space-y-4">
            <p><strong>Method Name:</strong> {data.methodName}</p>
            <p><strong>Description:</strong> {data.description}</p>
            <p>
              <strong>Status:</strong> 
              {data.isActive ? " Active ✅" : " Inactive ❌"}
            </p>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IDPaymentMethod;
