import { useEffect, useState } from "react";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AxiosAPI from "@/configs/axios";

import { FilePenLine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Sticker, StickerStyle } from "@/types/type";
import { useToast } from "@/hooks/use-toast";
const UpdateSticker = ({
     id,
     onUpdated,
}: {
     id: number;
     onUpdated?: () => void;
}) => {
     const [open, setOpen] = useState(false);
     const [loading, setLoading] = useState(false);
     const [form, setForm] = useState({
          name: "",
          stickerStyleId: "",
     });
     const [image, setImage] = useState<File | null>(null);
     const [styles, setStyles] = useState<StickerStyle[]>([]);
     const {toast} = useToast();
     // Fetch sticker styles
     useEffect(() => {
          if (!open) return;

          const fetchStyles = async () => {
               try {
                    const res = await AxiosAPI.get("/api/StickerStyle/all");
                    setStyles(res.data as any);
               } catch (err) {
                    toast({
                         className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
                         variant: "destructive",
                         title: "Error", // Thay thế t("errorTitle")
                         description: "An error occurred", // Thay thế t("errorDesc")
                       })
                    console.error(err);
               }
          };

          fetchStyles();
     }, [open]);


     useEffect(() => {
          if (!open) return;

          const fetchData = async () => {
               try {
                    setLoading(true);
                    const res = await AxiosAPI.get<Sticker>(`/api/Sticker/${id}`);
                    const data = res.data;
                    const matchedStyle = styles.find(style =>
                         style.stickerStyleName === data?.stickerStyleName
                    );

                    setForm({
                         name: data?.name || "",
                         stickerStyleId: matchedStyle?.id.toString() || "", // Đảm bảo là string của number
                    });
               } catch (err) {
                    toast({
                         className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
                         variant: "destructive",
                         title: "Error", // Thay thế t("errorTitle")
                         description: "An error occurred", // Thay thế t("errorDesc")
                       })
                    console.error(err);
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, [open, id]);

     const handleUpdate = async () => {
          try {
               const formData = new FormData();
               formData.append("name", form.name);
               formData.append("stickerStyleId", form.stickerStyleId);
               if (image) {
                    formData.append("StickerFile", image);
               }

               await AxiosAPI.put(`/api/Sticker/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
               });

               toast({
                    className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
                    title: "Success", // Thay thế t("successTitle")
                    description: "Operation completed successfully", // Thay thế t("successDesc")
                  })
               setOpen(false);
               onUpdated?.();
          } catch (error) {
               toast({
                    className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
                    variant: "destructive",
                    title: "Error", // Thay thế t("errorTitle")
                    description: "An error occurred", // Thay thế t("errorDesc")
                  })
               console.error(error);
          }
     };

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline">
                         <FilePenLine />
                    </Button>
               </DialogTrigger>
               <DialogContent role="dialog" aria-modal="false">
                    <DialogHeader>
                         <DialogTitle>Sửa Sticker</DialogTitle>
                    </DialogHeader>

                    {loading ? (
                         <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
                    ) : (
                         <div className="space-y-4">
                              <div className="flex flex-col space-y-1.5">
                                   <Label>Tên Sticker</Label>
                                   <Input
                                        placeholder="Tên Sticker"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                   />
                              </div>

                              <div className="flex flex-col space-y-1.5">
                                   <Label>Kiểu Sticker</Label>
                                   <select
                                        value={form.stickerStyleId}
                                        onChange={(e) => setForm({ ...form, stickerStyleId: e.target.value })}
                                   >
                                        <option value="">Chọn kiểu</option>
                                        {styles.map((style) => (
                                             <option key={style.id} value={style.id}> {/* value phải là id (number) */}
                                                  {style.stickerStyleName} {/* Chỉ hiển thị tên */}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="flex flex-col space-y-1.5">
                                   <Label>Cập nhật hình ảnh mới (tùy chọn)</Label>
                                   <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                                   />
                              </div>

                              <Button onClick={handleUpdate} className="w-full mt-2">
                                   Cập nhật
                              </Button>
                         </div>
                    )}
               </DialogContent>
          </Dialog>
     );
};

export default UpdateSticker;
