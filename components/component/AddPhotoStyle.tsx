import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";

import { CirclePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const photoStyleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  prompt: z.string().optional(),
  negativePrompt: z.string().optional(),
  controlnets: z.string().optional(),
  numImagesPerGen: z.coerce.number().min(1),
  backgroundColor: z.string().optional(),
  height: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  mode: z.coerce.number().min(0).max(1).default(0),

  numInferenceSteps: z.coerce.number().min(0),
  guidanceScale: z.coerce.number().min(0),
  strength: z.coerce.number().min(0).max(1),
  ipAdapterScale: z.coerce.number().min(0).optional(),
  backgroundRemover: z.boolean().optional(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image file is required"),
});

type PhotoStyleFormData = z.infer<typeof photoStyleSchema>;

interface AddPhotoStyleProps {
  onAddSuccess: () => void;
}

const AddPhotoStyle: React.FC<AddPhotoStyleProps> = ({ onAddSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PhotoStyleFormData>({
    resolver: zodResolver(photoStyleSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      prompt: "",
      negativePrompt: "",
      controlnets: "",
      numImagesPerGen: 1,
      backgroundColor: "#ffffff",
      height: 0,
      width: 0,
      mode: 0,
      numInferenceSteps: 20,
      guidanceScale: 7.5,
      strength: 0,
      ipAdapterScale: 0,
      backgroundRemover: false,
    },
  });

  const onSubmit = async (data: PhotoStyleFormData) => {
    if (loading) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
      formDataToSend.set("ImageUrl", data.imageFile); // 👈 this is the key expected by backend

      await AxiosAPI.post("/api/PhotoStyle", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })


      reset();
      setPreviewImage(null);
      setIsOpen(false);
      onAddSuccess();
    } catch (error: any) {
      console.error("Create error:", error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("imageFile", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Photo Style</DialogTitle>
          <DialogDescription>
            Fill the form to add a new photo style.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 max-h-40" />
            )}
            {errors.imageFile && (
              <p className="text-sm text-red-500">{errors.imageFile.message}</p>
            )}
          </div>
          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Input {...register("description")} />
          </div>
          <div>
            <Label>Prompt</Label>
            <Input {...register("prompt")} />
          </div>
          <div>
            <Label>Negative Prompt</Label>
            <Input {...register("negativePrompt")} />
          </div>
          <div>
            <Label>Controlnets</Label>
            <Input {...register("controlnets")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Images/Gen</Label>
              <Input type="number" {...register("numImagesPerGen")} />
            </div>
            <div>
              <Label>Background</Label>
              <Input type="color" {...register("backgroundColor")} />
            </div>
            <div>
              <Label>Height</Label>
              <Input type="number" {...register("height")} />
            </div>
            <div>
              <Label>Width</Label>
              <Input type="number" {...register("width")} />
            </div>
            <div>
              <Label>Mode</Label>
              <select
                {...register("mode")}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value={0}>Not keep face</option>
                <option value={1}>Keep face</option>
              </select>
              {errors.mode && (
                <p className="text-sm text-red-500">{errors.mode.message}</p>
              )}
            </div>

            <div>
              <Label>Inference Steps</Label>
              <Input type="number" {...register("numInferenceSteps")} />
            </div>
            <div>
              <Label>Guidance Scale</Label>
              <Input type="number" step="0.1" {...register("guidanceScale")} />
            </div>
            <div>
              <Label>Strength</Label>
              <Input type="number" step="0.1" {...register("strength")} />
            </div>
            <div>
              <Label>IP Adapter Scale</Label>
              <Input
                type="number"
                step="0.01"
                min="0"

                {...register("ipAdapterScale")}
              />
              {errors.ipAdapterScale && (
                <p className="text-sm text-red-500">{errors.ipAdapterScale.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              checked={watch("backgroundRemover")}
              onCheckedChange={(checked) =>
                setValue("backgroundRemover", checked)
              }
            />
            <Label>Remove Background</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Style"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoStyle;
