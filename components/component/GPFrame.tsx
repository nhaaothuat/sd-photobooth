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
import { Checkbox } from "@/components/ui/checkbox";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";
import { FilePenLine } from "lucide-react";
import { Frame, FrameStyle } from "@/types/type";

const UpdateFrame = ({ id, onUpdated }: { id: number; onUpdated?: () => void }) => {
     const [open, setOpen] = useState(false);
     const [loading, setLoading] = useState(false);
     const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([]);
     const [form, setForm] = useState({
          name: "",
          frameStyleId: "",
          slotCount: 0,
          forMobile: false,
     });
     const [frameFile, setFrameFile] = useState<File | null>(null);

     // Fetch FrameStyles
     useEffect(() => {
          const fetchFrameStyles = async () => {
               try {
                    const res = await AxiosAPI.get("/api/FrameStyle");
                    setFrameStyles(res.data as FrameStyle[]);
               } catch (err) {
                    toast.error("Lỗi khi lấy danh sách frame style");
                    console.error(err);
               }
          };

          if (open) {
               fetchFrameStyles();
          }
     }, [open]);

     // Fetch Frame data
     useEffect(() => {
          if (!open) return;

          const fetchData = async () => {
               try {
                    setLoading(true);
                    const res = await AxiosAPI.get<Frame>(`/api/Frame/${id}`);
                    const data = res.data;
                    setForm({
                         name: data?.name || "",
                         frameStyleId: data?.frameStyleId?.toString() || "",
                         slotCount: data?.slotCount || 0,
                         forMobile: data?.forMobile ?? false,
                    });
               } catch (err) {
                    toast.error("Lỗi khi lấy thông tin frame");
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
               formData.append("Name", form.name);
               formData.append("FrameStyleId", form.frameStyleId);
               formData.append("SlotCount", form.slotCount.toString());
               formData.append("ForMobile", String(form.forMobile));
               if (frameFile) {
                    formData.append("FrameFile", frameFile);
               }

               await AxiosAPI.put(`/api/Frame/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
               });

               toast.success("Cập nhật Frame thành công!");
               setOpen(false);
               onUpdated?.();
          } catch (error) {
               toast.error("Cập nhật Frame thất bại");
               console.error(error);
          }
     };

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline"><FilePenLine /></Button>
               </DialogTrigger>
               <DialogContent role="dialog" aria-modal="false">
                    <DialogHeader>
                         <DialogTitle>Sửa Frame</DialogTitle>
                    </DialogHeader>

                    {loading ? (
                         <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
                    ) : (
                         <div className="space-y-4">
                              <Input
                                   type="file"
                                   onChange={(e) => setFrameFile(e.target.files?.[0] || null)}
                              />
                              <Input
                                   placeholder="Tên Frame"
                                   value={form.name}
                                   onChange={(e) => setForm({ ...form, name: e.target.value })}
                              />
                              <select
                                   value={form.frameStyleId}
                                   onChange={(e) => setForm({ ...form, frameStyleId: e.target.value })}
                                   className="border border-input bg-background px-3 py-2 rounded-md text-sm w-full"
                              >
                                   <option value="" disabled>Chọn Frame Style</option>
                                   {frameStyles.map((style) => (
                                        <option key={style.id} value={style.id}>
                                             {style.name}
                                        </option>
                                   ))}
                              </select>
                              <Input
                                   placeholder="SlotCount"
                                   type="number"
                                   value={form.slotCount}
                                   onChange={(e) => setForm({ ...form, slotCount: Number(e.target.value) })}
                              />
                              <div className="flex items-center gap-2">
                                   <Checkbox
                                        checked={form.forMobile}
                                        onCheckedChange={(val) =>
                                             setForm({ ...form, forMobile: Boolean(val) })
                                        }
                                   />
                                   <span>Dành cho di động</span>
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

export default UpdateFrame;
