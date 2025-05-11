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
  ColorInput,
  FileInput,
  Image,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AxiosAPI from "@/configs/axios";

import { CiEdit } from "react-icons/ci";
import { PhotoStyle } from "@/types/type";
import { useToast } from "@/hooks/use-toast";

const EditPhotoStyle = ({
  id,
  onUpdateSuccess,
}: {
  id: number;
  onUpdateSuccess: () => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PhotoStyle & { imageFile?: File | null }>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    if (!opened) return;

    const fetchPhotoStyle = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<PhotoStyle>(`/api/PhotoStyle/${id}`);
        setFormData(res.data as any);
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

    fetchPhotoStyle();
  }, [opened, id]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setFormData((prev) => ({ ...prev, imageFile: file }));
    } else {
      setPreviewImage(null);
      setFormData((prev) => ({ ...prev, imageFile: null }));
    }
  };

  const handleChange = <K extends keyof PhotoStyle>(
    field: K,
    value: PhotoStyle[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      if (formData.imageFile instanceof File) {
        formDataToSend.append("ImageUrl", formData.imageFile); // 👈 key đúng với backend
      }

      formDataToSend.append("Name", formData.name ?? "");
      formDataToSend.append("Description", formData.description ?? "");
      formDataToSend.append("Prompt", formData.prompt ?? "");
      formDataToSend.append("NegativePrompt", formData.negativePrompt ?? "");
      formDataToSend.append("Controlnets", formData.controlnets ?? "");
      formDataToSend.append("NumImagesPerGen", String(formData.numImagesPerGen ?? 1));
      formDataToSend.append("BackgroundColor", formData.backgroundColor ?? "#ffffff");
      formDataToSend.append("Height", String(formData.height ?? 0));
      formDataToSend.append("Width", String(formData.width ?? 0));
      formDataToSend.append("Mode", String(formData.mode ?? 1));
      formDataToSend.append("NumInferenceSteps", String(formData.numInferenceSteps ?? 0));
      formDataToSend.append("GuidanceScale", String(formData.guidanceScale ?? 0));
      formDataToSend.append("Strength", String(formData.strength ?? 0));
      formDataToSend.append("IPAdapterScale", String(formData.ipAdapterScale ?? 0));
      formDataToSend.append("BackgroundRemover", String(formData.backgroundRemover ?? false));

      await AxiosAPI.put(`/api/PhotoStyle/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

     
      <Modal opened={opened} onClose={close} title="Edit Photo Style" centered size="lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack gap="sm">
          {(previewImage || formData.imageUrl) && (
            <Image
              src={previewImage || formData.imageUrl!}
              height={200}
              fit="contain"
              alt="Current style image"
            />
          )}
          <FileInput
            placeholder="Upload image"
            label="New Style Image"
            accept="image/*"
            onChange={handleFileChange}
          />
          <TextInput
            label="Style Name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
            required
          />
          <TextInput
            label="Description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
          />
          <TextInput
            label="Prompt"
            value={formData.prompt || ""}
            onChange={(e) => handleChange("prompt", e.currentTarget.value)}
          />
          <TextInput
            label="Negative Prompt"
            value={formData.negativePrompt || ""}
            onChange={(e) => handleChange("negativePrompt", e.currentTarget.value)}
          />
          <TextInput
            label="Controlnets"
            value={formData.controlnets || ""}
            onChange={(e) => handleChange("controlnets", e.currentTarget.value)}
          />
          <NumberInput
            label="Images per Generation"
            value={formData.numImagesPerGen || 0}
            onChange={(v) => handleChange("numImagesPerGen", Number(v))}
            min={1}
          />
          <ColorInput
            label="Background Color"
            value={formData.backgroundColor || "#ffffff"}
            onChange={(v) => handleChange("backgroundColor", v)}
          />
          <Group grow>
            <NumberInput
              label="Height"
              value={formData.height || 0}
              onChange={(v) => handleChange("height", Number(v))}
              min={0}
            />
            <NumberInput
              label="Width"
              value={formData.width || 0}
              onChange={(v) => handleChange("width", Number(v))}
              min={0}
            />
          </Group>
          <Select
            label="Mode"
            data={[
              { value: "1", label: "Keep Face" },
              { value: "2", label: "Keep Structure" },
            ]}
            value={formData.mode?.toString() || null}
            onChange={(value) => handleChange("mode", value ? parseInt(value) : 1)}
          />
          <NumberInput
            label="Inference Steps"
            value={formData.numInferenceSteps || 0}
            onChange={(v) => handleChange("numInferenceSteps", Number(v))}
            min={0}
          />
          <NumberInput
            label="Guidance Scale"
            value={formData.guidanceScale || 0}
            onChange={(v) => handleChange("guidanceScale", Number(v))}
            min={0}
            step={0.1}
          />
          <NumberInput
            label="Strength"
            value={formData.strength || 0}
            onChange={(v) => handleChange("strength", Number(v))}
            min={0}
            max={1}
            step={0.1}
          />
          <NumberInput
            label="IP Adapter Scale"
            value={formData.ipAdapterScale || 0}
            onChange={(v) => handleChange("ipAdapterScale", Number(v))}
            min={0}
            step={0.1}
          />
          <Checkbox
            label="Remove Background"
            checked={formData.backgroundRemover || false}
            onChange={(e) => handleChange("backgroundRemover", e.currentTarget.checked)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

    </>
  );
};

export default EditPhotoStyle;
