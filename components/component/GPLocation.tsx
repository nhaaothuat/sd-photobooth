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
import { Location } from "@/types/type";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
interface UpdateLocationProps {
  id: number;
  onUpdateSuccess: () => void;
}

const UpdateLocation = ({ id, onUpdateSuccess }: UpdateLocationProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
  });
  const { toast } = useToast();
  const t = useTranslations("toast");
  const a = useTranslations("manager");

  useEffect(() => {
    if (!opened) return;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<Location>(`/api/Location/${id}`);
        const data = res.data;
        setFormData({
          locationName: data?.locationName || "",
          address: data?.address || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
          variant: "destructive",
          title: t("errorTitle"),
          description: t("errorDesc"),

        })
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [opened, id]);

  const handleChange = (field: "locationName" | "address", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await AxiosAPI.put(`/api/Location/${id}`, formData);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: t("successTitle"),
        description: t("successDesc"),
      })
      close();
      onUpdateSuccess();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorDesc"),

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

      <Modal opened={opened} onClose={close} title={a("editTitle")} centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack gap="sm">
          <TextInput
            label={a("nameLabel")}
            value={formData.locationName}
            onChange={(e) => handleChange("locationName", e.currentTarget.value)}
            required
          />
          <TextInput
            label={a("addressLabel")}
            value={formData.address}
            onChange={(e) => handleChange("address", e.currentTarget.value)}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              {a("cancel")}
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              {a("update")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default UpdateLocation;
