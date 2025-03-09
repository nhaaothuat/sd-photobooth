import { useState, useCallback } from "react";
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
import { BellRing } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Ensure correct import
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

interface AddPaymentProps {
     onAddSuccess: () => void;
}

const AddPayment: React.FC<AddPaymentProps> = ({ onAddSuccess }) => {
     const [formData, setFormData] = useState({
          methodName: "",
          description: "",
          isActive: true,
     });

     const [isOpen, setIsOpen] = useState(false);
     const [loading, setLoading] = useState(false); // Track form submission state

     // Handle input changes
     const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
               const { id, value } = e.target;
               setFormData((prev) => ({ ...prev, [id]: value }));
          },
          []
     );

     // Handle Switch toggle
     const handleToggle = useCallback((checked: boolean) => {
          setFormData((prev) => ({ ...prev, isActive: checked }));
     }, []);

     // Submit form
     const handleSubmit = useCallback(
          async (e: React.FormEvent) => {
               e.preventDefault();
               if (loading) return;
               setLoading(true);

               try {
                    await AxiosAPI.post("api/PaymentMethod", formData);
                    toast.success("Payment method added successfully!");

                    // Reset form & close modal
                    setFormData({ methodName: "", description: "", isActive: true });
                    setIsOpen(false);
                    onAddSuccess();
               } catch (err: any) {
                    console.error("Save Error:", err);
                    toast.error(err.response?.data?.message || "Something went wrong");
               } finally {
                    setLoading(false);
               }
          },
          [formData, loading, onAddSuccess]
     );

     return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">Add Payment Method</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>Add Payment Method</DialogTitle>
                         <DialogDescription>
                              Fill in the details and click save when you're done.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                         <div className="grid w-full items-center gap-4">
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="methodName">Method Name</Label>
                                   <Input
                                        id="methodName"
                                        placeholder="Enter method name"
                                        value={formData.methodName}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="description">Description</Label>
                                   <Input
                                        id="description"
                                        placeholder="Enter description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex items-center space-x-4 rounded-md border p-4">
                                   <BellRing />
                                   <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Status</p>
                                        <p className="text-sm text-muted-foreground">
                                             Enable or disable this payment method.
                                        </p>
                                   </div>
                                   <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleToggle} />
                              </div>
                         </div>
                         <DialogFooter>
                              <Button type="submit" disabled={loading}>
                                   {loading ? "Saving..." : "Save Changes"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     );
};

export default AddPayment;
