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
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

// Schema validation với Zod
const formSchema = z.object({
     locationName: z.string().min(1, "Location Name is required").max(100, "Max length is 100 characters"),
     address: z.string().min(1, "Address is required").max(200, "Max length is 200 characters"),
});

interface AddLocationProps {
     onAddSuccess: () => void;
}

const AddLocation: React.FC<AddLocationProps> = ({ onAddSuccess }) => {
     const [isOpen, setIsOpen] = useState(false);
     const [loading, setLoading] = useState(false);

     const {
          register,
          handleSubmit,
          reset,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(formSchema),
          defaultValues: {
               locationName: "",
               address: "",
          },
     });

     // Xử lý gửi form
     const onSubmit = async (values: any) => {
          if (loading) return;
          setLoading(true);

          try {
               await AxiosAPI.post("api/Location", values);
               toast.success("Location added successfully!");
               reset();
               setIsOpen(false);
               onAddSuccess();
          } catch (err: any) {
               console.error("Save Error:", err);
               toast.error(err.response?.data?.message || "Something went wrong");
          } finally {
               setLoading(false);
          }
     };

     return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">Add Location</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>Add Location</DialogTitle>
                         <DialogDescription>
                              Enter location details and click save when you're done.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                         <div className="grid w-full items-center gap-4">
                              {/* Location Name */}
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="locationName">Location Name</Label>
                                   <Input id="locationName" placeholder="Enter location name" {...register("locationName")} />
                                   {errors.locationName && <p className="text-red-500 text-sm">{errors.locationName.message}</p>}
                              </div>
                              {/* Address */}
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="address">Address</Label>
                                   <Input id="address" placeholder="Enter address" {...register("address")} />
                                   {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
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

export default AddLocation;
