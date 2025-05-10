import React, { useState } from "react";
import { Button, Modal, Group, Text, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AxiosAPI from "@/configs/axios";

import { IconTrash } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteDepositProductProps {
  id: number;
  onDeleteSuccess: () => void; // Callback khi xóa thành công
}

const DeleteDepositProduct = ({
  id,
  onDeleteSuccess,
}: DeleteDepositProductProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {toast} = useToast();
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await AxiosAPI.delete(`/api/DepositProduct/${id}`);

      if (response.status === 204) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
          title: "Success", // Thay thế t("successTitle")
          description: "Operation completed successfully", // Thay thế t("successDesc")
        })
        onDeleteSuccess();
        close();
      } else {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          variant: "destructive",
          title: "Error", // Thay thế t("errorTitle")
          description: "An error occurred", // Thay thế t("errorDesc")
        })
      }
    } catch (error) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        color="red"
        onClick={open}
        leftSection={<IconTrash size={16} />}
      >
        Xóa
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Xác nhận xóa sản phẩm"
        centered
      >
        <LoadingOverlay visible={isDeleting} />
        <Text mb="md">
          Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn
          tác.
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Hủy bỏ
          </Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>
            Xác nhận xóa
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DeleteDepositProduct;
