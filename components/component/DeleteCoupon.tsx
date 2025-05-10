import React, { useState } from "react";
import { Modal, TextInput, Button, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import AxiosAPI from "@/configs/axios";
import { useToast } from "@/hooks/use-toast";

interface AddCouponProps {
  onAddSuccess: () => void;
}

const DeleteCoupon: React.FC<AddCouponProps> = ({ onAddSuccess }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false); // Trạng thái mở Modal
  const { toast } = useToast();
  const deleteCoupon = async () => {
    if (!code) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
      return;
    }
    setLoading(true);
    try {
      await AxiosAPI.delete(`api/Coupon/${code}`);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      setCode("");
      setOpened(false); // Đóng modal sau khi xóa thành công
      onAddSuccess();
    } catch (err) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút mở modal */}
      <ActionIcon variant="outline" color="red" onClick={() => setOpened(true)}>
        <IconTrash size={20} />
      </ActionIcon>

      {/* Modal nhập mã giảm giá */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Xóa mã giảm giá">
        <TextInput
          label="Mã giảm giá"
          placeholder="Nhập mã giảm giá cần xóa"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="default" onClick={() => setOpened(false)} disabled={loading}>
            Hủy
          </Button>
          <Button color="red" onClick={deleteCoupon} loading={loading}>
            Xóa mã
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteCoupon;
