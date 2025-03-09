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
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

interface AddLocationProps {
     onAddSuccess: () => void;
}

const AddLocation: React.FC<AddLocationProps> = ({ onAddSuccess }) => {
     const [formData, setFormData] = useState({
          locationName: "",
          address: "",
     });

     const [isOpen, setIsOpen] = useState(false);
     const [loading, setLoading] = useState(false);

     // Handle input changes
     const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
               const { id, value } = e.target;
               setFormData((prev) => ({ ...prev, [id]: value }));
          },
          []
     );

     // Submit form
     const handleSubmit = useCallback(
          async (e: React.FormEvent) => {
               e.preventDefault();
               if (loading) return;
               setLoading(true);

               try {
                    await AxiosAPI.post("api/Location", formData);
                    toast.success("Location added successfully!");

                    // Reset form & close modal
                    setFormData({ locationName: "", address: "" });
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
                    <Button variant="outline">Add Location</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>Add Location</DialogTitle>
                         <DialogDescription>
                              Enter location details and click save when you're done.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                         <div className="grid w-full items-center gap-4">
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="locationName">Location Name</Label>
                                   <Input
                                        id="locationName"
                                        placeholder="Enter location name"
                                        value={formData.locationName}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="address">Address</Label>
                                   <Input
                                        id="address"
                                        placeholder="Enter address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                   />
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
