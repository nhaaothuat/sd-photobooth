import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Stack,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { CiEdit } from "react-icons/ci";
import AxiosAPI from "@/configs/axios";
import { StickerStyle } from "@/types/type";
import { useToast } from "@/hooks/use-toast";

const UpdateStickerStyle = ({
  id,
  onUpdateSuccess,
}: {
  id: number;
  onUpdateSuccess: () => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stickerStyleName: "",
    description: "",
  });
  const {toast} = useToast();
  useEffect(() => {
    if (!opened) return;

    const fetchStickerStyle = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<StickerStyle>(`/api/StickerStyle/${id}`);
        const data = res.data;
        setFormData({
          stickerStyleName: data?.stickerStyleName || "",
          description: data?.description || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
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

    fetchStickerStyle();
  }, [opened, id]);

  const handleChange = (field: "stickerStyleName" | "description", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await AxiosAPI.put(`/api/StickerStyle/${id}`, formData);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      close();
      onUpdateSuccess();
    } catch (error) {
      console.error("Update error:", error);
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
      <Button variant="outline" onClick={open}>
        <CiEdit />
      </Button>

      <Modal opened={opened} onClose={close} title="Chỉnh sửa Sticker Style" centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack gap="sm">
          <TextInput
            label="Tên Sticker Style"
            value={formData.stickerStyleName}
            onChange={(e) => handleChange("stickerStyleName", e.currentTarget.value)}
            required
          />
          <TextInput
            label="Mô tả"
            value={formData.description}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default UpdateStickerStyle;
