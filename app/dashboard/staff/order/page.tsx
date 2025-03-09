"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AxiosAPI from "@/configs/axios";

// 🔹 Define Request & Response Types
interface OrderRequest {
  email: string;
  phone: string;
  typeSessionId: number;
  paymentMethodId: number;
}

interface OrderResponse {
  paymentLink: string;
}

const Order = () => {
  const [formData, setFormData] = React.useState<OrderRequest>({
    email: "",
    phone: "",
    typeSessionId: 0,
    paymentMethodId: 0,
  });
  const [paymentLink, setPaymentLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "typeSessionId" || name === "paymentMethodId" ? Number(value) : value,
    }));
  };

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    try {
      const response = await AxiosAPI.post("api/Order", formData);
      var data = response.data as unknown as OrderResponse;
      if (data.paymentLink) {
        setPaymentLink(data.paymentLink);
        setIsDialogOpen(true); // 🔹 Mở Dialog khi có paymentLink
      } else {
        console.error("No payment link received.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Order Form</CardTitle>
          <CardDescription>Fill in the details below to place an order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Email</Label>
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Type Session ID</Label>
              <Input type="number" name="typeSessionId" value={formData.typeSessionId} onChange={handleChange} placeholder="Enter type session ID" required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Payment Method ID</Label>
              <Input type="number" name="paymentMethodId" value={formData.paymentMethodId} onChange={handleChange} placeholder="Enter payment method ID" required />
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* 🔹 Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Page</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[600px] border rounded-md overflow-hidden">
            {paymentLink && <iframe src={paymentLink} className="w-full h-full" title="Payment Page"></iframe>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Order;
