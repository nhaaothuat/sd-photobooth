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
import { FrameStyle } from "@/types/type";
import { useToast } from "@/hooks/use-toast";

const UpdateFrameStyle = ({ id, onUpdated }: { id: number; onUpdated?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const {toast} = useToast();

  // Fetch existing FrameStyle data
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<FrameStyle>(`/api/FrameStyle/${id}`);
        const data = res.data;
        setForm({
          name: data?.name || "",
          description: data?.description || "",
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
      formData.append("Name", form.name);
      formData.append("Description", form.description);
      if (image) {
        formData.append("Image", image);
      }

      await AxiosAPI.put(`/api/FrameStyle/${id}`, formData, {
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
          <DialogTitle>Sửa FrameStyle</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
        ) : (
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <Input
              placeholder="Tên FrameStyle"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Button onClick={handleUpdate} className="w-full mt-2">
              Cập nhật
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFrameStyle;
