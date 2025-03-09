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
import { FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";

interface AddTypeSessionProps {
     onAddSuccess: () => void;
}

const AddTypeSession: React.FC<AddTypeSessionProps> = ({ onAddSuccess }) => {
     const [formData, setFormData] = useState({
          name: "",
          description: "",
          duration: 0,
          price: 0,
          isPrinting: true,
          ableTakenNumber: 0,
     });

     const [isOpen, setIsOpen] = useState(false);
     const [loading, setLoading] = useState(false);

     // Handle input changes
     const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
               const { id, value } = e.target;
               setFormData((prev) => ({
                    ...prev,
                    [id]: id === "duration" || id === "price" || id === "ableTakenNumber" ? Number(value) : value,
               }));
          },
          []
     );

     // Handle Switch toggle
     const handleToggle = useCallback((checked: boolean) => {
          setFormData((prev) => ({ ...prev, isPrinting: checked }));
     }, []);

     // Submit form
     const handleSubmit = useCallback(
          async (e: React.FormEvent) => {
               e.preventDefault();
               if (loading) return;
               setLoading(true);

               try {
                    await AxiosAPI.post("api/TypeSession", formData);
                    toast.success("Type session added successfully!");

                    // Reset form & close modal
                    setFormData({
                         name: "",
                         description: "",
                         duration: 0,
                         price: 0,
                         isPrinting: true,
                         ableTakenNumber: 0,
                    });
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
                    <Button variant="outline">Add Type Session</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>Add Type Session</DialogTitle>
                         <DialogDescription>
                              Fill in the details and click save when you're done.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                         <div className="grid w-full items-center gap-4">
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="name">Session Name</Label>
                                   <Input
                                        id="name"
                                        placeholder="Enter session name"
                                        value={formData.name}
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
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="duration">Duration (minutes)</Label>
                                   <Input
                                        type="number"
                                        id="duration"
                                        placeholder="Enter duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="price">Price</Label>
                                   <Input
                                        type="number"
                                        id="price"
                                        placeholder="Enter price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="ableTakenNumber">Max Participants</Label>
                                   <Input
                                        type="number"
                                        id="ableTakenNumber"
                                        placeholder="Enter max participants"
                                        value={formData.ableTakenNumber}
                                        onChange={handleChange}
                                        required
                                   />
                              </div>
                              <div className="flex items-center space-x-4 rounded-md border p-4">
                                   <FileText />
                                   <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Print Ticket</p>
                                        <p className="text-sm text-muted-foreground">
                                             Enable or disable printing for this session.
                                        </p>
                                   </div>
                                   <Switch id="isPrinting" checked={formData.isPrinting} onCheckedChange={handleToggle} />
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

export default AddTypeSession;
