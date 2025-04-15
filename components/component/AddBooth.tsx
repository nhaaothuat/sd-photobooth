"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";
import { Upload, Smartphone, Image, PlusCircle } from "lucide-react";
import { Location } from "@/types/type";

const boothSchema = z.object({
  boothName: z.string().min(1, "Name is required"),
  locationId: z.string().min(1, "FrameStyleId is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean().optional(),
 
});

type BoothFormData = z.infer<typeof boothSchema>;

const  AddBooth = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await AxiosAPI.get("/api/Location");
        setLocations(res.data as Location[]);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BoothFormData>({
    resolver: zodResolver(boothSchema),
    mode: "onChange",
    defaultValues: {
      boothName: "",
      locationId: "",
      description: "",
      status: true,
    },
  });

  const status = watch("status");

  const onSubmit = async (data: BoothFormData) => {
    try {
      setLoading(true);
      await AxiosAPI.post("/api/Booth", {
        locationId: Number(data.locationId),
        boothName: data.boothName,
        description: data.description,
        status: data.status ?? true,
      });
      toast.success("Booth added successfully!");
      reset();
      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error while adding location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Booth</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Location</DialogTitle>
        <DialogDescription>Enter location info</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="boothName">Booth Name</Label>
            <Input id="boothName" {...register("boothName")} />
            {errors.boothName && <p className="text-sm text-red-500">{errors.boothName.message}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="locationId">Location</Label>
            <select
              id="locationId"
              {...register("locationId")}
              className="border border-input bg-background px-3 py-2 rounded-md text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                {loadingLocations ? "Loading..." : "Select location"}
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.locationName}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="text-sm text-red-500">{errors.locationId.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Smartphone />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">Enable or disable this location</p>
            </div>
            <Switch
              id="status"
              checked={status}
              onCheckedChange={(checked) => setValue("status", checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Location"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  );
};

export default AddBooth;
