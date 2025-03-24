import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

const couponSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max length is 100 characters"),
  description: z.string().max(500, "Max length is 500 characters").optional(),
  code: z.string().min(1, "Code is required").max(50, "Max length is 50 characters"),
  discount: z.coerce.number().min(1, "Discount must be at least 1"),
  discountPercent: z.coerce.number().min(0, "Minimum is 0").max(1, "Maximum is 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxUse: z.coerce.number().min(1, "Must be at least 1").optional(),
  usedAmount: z.coerce.number().default(0),
  maxDiscount: z.coerce.number().min(0, "Minimum is 0").optional(),
  minOrder: z.coerce.number().min(0, "Minimum is 0").optional(),
  isActive: z.boolean(),
});

interface AddCouponProps {
  onAddSuccess: () => void;
}

const AddCoupon: React.FC<AddCouponProps> = ({ onAddSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
      discount: 0,
      discountPercent: 0,
      startDate: "",
      endDate: "",
      maxUse: 0,
      usedAmount: 0,
      maxDiscount: 0,
      minOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = async (values: any) => {
    if (loading) return;
    setLoading(true);

    try {
      await AxiosAPI.post("api/Coupon", values);
      toast.success("Coupon added successfully!");
      reset();
      setIsOpen(false);
      onAddSuccess();
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Coupon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Coupon</DialogTitle>
          <DialogDescription>Enter coupon details and click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            {[
              { label: "Name", id: "name" },
              { label: "Description", id: "description" },
              { label: "Code", id: "code" },
              { label: "Discount", id: "discount", type: "number" },
              { label: "Discount Percent", id: "discountPercent", type: "number" },
              { label: "Start Date", id: "startDate", type: "date" },
              { label: "End Date", id: "endDate", type: "date" },
              { label: "Max Use", id: "maxUse", type: "number" },
              { label: "Used Amount", id: "usedAmount", type: "number" },
              { label: "Max Discount", id: "maxDiscount", type: "number" },
              { label: "Min Order", id: "minOrder", type: "number" },
            ].map(({ label, id, type = "text" }) => (
              <div key={id} className="flex flex-col space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} type={type} {...register(id as any)} placeholder={`Enter ${label.toLowerCase()}`} />
                {errors[id as keyof typeof errors] && (
                  <p className="text-red-500 text-sm">{errors[id as keyof typeof errors]?.message as string}</p>
                )}
              </div>
            ))}
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Active Status</p>
                <p className="text-sm text-muted-foreground">Toggle to enable or disable the coupon.</p>
              </div>
              <Switch {...register("isActive")} checked={watch("isActive")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Coupon"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoupon;