import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Stack,
  Group,
  LoadingOverlay,
  Checkbox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AxiosAPI from "@/configs/axios";

import { CiEdit } from "react-icons/ci";
import { TypeSession } from "@/types/type";
import { useToast } from "@/hooks/use-toast";

const EditTypeSession = ({
  id,
  onUpdateSuccess,
}: {
  id: number;
  onUpdateSuccess: () => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "" ,
    description: "",
    duration: 0,
    price: 0,
   
    forMobile:true,
    ableTakenNumber: 0,
  });
  const {toast} = useToast();
  useEffect(() => {
    if (!opened) return;

    const fetchTypeSession = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<TypeSession>(`/api/TypeSession/${id}`);
        const data = res.data;
        setFormData({
          name: data?.name || "",
          description: data?.description || "",
          duration: data?.duration || 0,
          price: data?.price || 0,
         
          forMobile: data?.forMobile ?? true,
          ableTakenNumber: data?.ableTakenNumber || 0,
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

    fetchTypeSession();
  }, [opened, id]);

  const handleChange = (
    field: keyof TypeSession,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" &&
        ["duration", "price", "ableTakenNumber"].includes(field)
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await AxiosAPI.put(`/api/TypeSession/${id}`, formData);
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

      <Modal opened={opened} onClose={close} title="Chỉnh sửa loại phiên" centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack gap="sm">
          <TextInput
            label="Tên phiên"
            placeholder="Nhập tên"
            value={formData.name}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
            required
          />
          <TextInput
            label="Mô tả"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
            required
          />
          <NumberInput
            label="Thời lượng (phút)"
            value={formData.duration}
            onChange={(value) => handleChange("duration", value || 0)}
            required
          />
          <NumberInput
            label="Giá"
            value={formData.price}
            onChange={(value) => handleChange("price", value || 0)}
            required
          />
          <NumberInput
            label="Số lượng tối đa"
            value={formData.ableTakenNumber}
            onChange={(value) => handleChange("ableTakenNumber", value || 0)}
            required
          />
      
           <Checkbox
            label="For Mobile"
            checked={formData.forMobile}
            onChange={(e) => handleChange("forMobile", e.currentTarget.checked)}
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

export default EditTypeSession;
