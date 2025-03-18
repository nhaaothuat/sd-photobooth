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

interface AddPhotoStyleProps {
     onAddSuccess: () => void;
}

const AddPhotoStyle: React.FC<AddPhotoStyleProps> = ({ onAddSuccess }) => {
     const [formData, setFormData] = useState({
          name: "",
          description: "",
          imageUrl: "",
     });

     const [isOpen, setIsOpen] = useState(false);
     const [loading, setLoading] = useState(false);

     const handleChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => {
               const { id, value } = e.target;
               setFormData((prev) => ({ ...prev, [id]: value }));
          },
          []
     );

     const handleSubmit = useCallback(
          async (e: React.FormEvent) => {
               e.preventDefault();
               if (loading) return;
               setLoading(true);

               try {
                    await AxiosAPI.post("api/PhotoStyle", formData);
                    toast.success("Photo style added successfully!");

                    setFormData({ name: "", description: "", imageUrl: "" });
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
                    <Button variant="outline">Add Photo Style</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>Add Photo Style</DialogTitle>
                         <DialogDescription>
                              Enter details and click save when done.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                         <div className="grid w-full items-center gap-4">
                              <div className="flex flex-col space-y-1.5">
                                   <Label htmlFor="name">Name</Label>
                                   <Input
                                        id="name"
                                        placeholder="Enter style name"
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
                                   <Label htmlFor="imageUrl">Image URL</Label>
                                   <Input
                                        id="imageUrl"
                                        placeholder="Enter image URL"
                                        value={formData.imageUrl}
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

export default AddPhotoStyle;