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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AxiosAPI from "@/configs/axios";

interface TypeSession {
  id: number;
  name: string;
}

interface PaymentMethod {
  id: number;
  methodName: string;
}

interface OrderRequest {
  email: string;
  phone: string;
  typeSessionId: number;
  paymentMethodId: number;
  coupon: string;
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
    coupon: "",
  });
  const [typeSessions, setTypeSessions] = React.useState<TypeSession[]>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(
    []
  );
  const [paymentLink, setPaymentLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeSessionRes, paymentMethodRes] = await Promise.all([
          AxiosAPI.get("/api/TypeSession"),
          AxiosAPI.get("/api/PaymentMethod/all/web"),
        ]);
        setTypeSessions(typeSessionRes.data as TypeSession[]);
        setPaymentMethods(paymentMethodRes.data as PaymentMethod[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeSessionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, typeSessionId: Number(value) }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethodId: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AxiosAPI.post("api/Order/dashboard", formData);
      const data = response.data as unknown as OrderResponse;
      if (data.paymentLink) {
        setPaymentLink(data.paymentLink);
        setIsDialogOpen(true);
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
          <CardDescription>
            Fill in the details below to place an order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Type Session</Label>
              <Select onValueChange={handleTypeSessionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {typeSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Coupon</Label>
              <Input
                name="email"
                value={formData.coupon}
                onChange={handleChange}
                placeholder="Enter coupon"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Payment Method</Label>
              <Select onValueChange={handlePaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id.toString()}>
                      {method.methodName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Page</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[600px] border rounded-md overflow-hidden">
            {paymentLink && (
              <iframe
                src={paymentLink}
                className="w-full h-full"
                title="Payment Page"
              ></iframe>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Order;
