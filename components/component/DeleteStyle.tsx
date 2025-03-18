import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const DeleteStyle: React.FC = () => {
  const [styleId, setStyleId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await AxiosAPI.delete(`api/PhotoStyle/${styleId}`);
      toast.success("Xóa phong cách chụp ảnh thành công!");
      setStyleId(""); // Reset input
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Xóa phong cách chụp ảnh thất bại!");
    } finally {
      setLoading(false);
      setOpenDialog(false); // Đóng dialog sau khi xử lý xong
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle>Xóa phong cách chụp ảnh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Nhập ID phong cách"
          value={styleId}
          onChange={(e) => setStyleId(e.target.value)}
        />
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogTrigger asChild>
            <Button disabled={!styleId} className="w-full" variant="destructive">
              Xóa phong cách
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa ?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phong cách ID: <b>{styleId}</b> không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={loading}>
                {loading ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default DeleteStyle;