"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState } from "react";
import { ZodType } from "zod";
import { toast } from "react-toastify";

type Field =
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
      description?: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: { label: string; value: string | number }[];
      loading?: boolean;
    }
  | {
      type: "switch";
      name: string;
      label: string;
      description?: string;
    }
  | {
      type: "number";
      name: string;
      label: string;
      description?: string;
    }
  | {
      type: "date";
      name: string;
      label: string;
      description?: string;
    };

interface CreateDialogFormProps<T> {
  title: string;
  description?: string;
  triggerText: string;
  schema: ZodType<T>;
  defaultValues?: T;
  fields: Field[];
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
}

const CreateDialogForm = <T extends FieldValues>({
  title,
  description,
  triggerText,
  schema,
  defaultValues,
  fields,
  onSubmit,
  onSuccess,
}: CreateDialogFormProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const onInternalSubmit = async (values: T) => {
    try {
      setLoading(true);
      await onSubmit(values);
      toast.success("Created successfully!");
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-4">
          {fields.map((field) => {
            const errorMsg = errors?.[field.name as keyof T]?.message;

            if (field.type === "text") {
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input id={field.name} {...register(field.name as any)} />
                  {field.description && (
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                  )}
                  {errorMsg && (
                    <p className="text-sm text-red-500">{`${errorMsg}`}</p>
                  )}
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <select
                    id={field.name}
                    {...register(field.name as any)}
                    className="border border-input bg-background px-3 py-2 rounded-md text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      {field.loading ? "Loading..." : "Select"}
                    </option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errorMsg && (
                    <p className="text-sm text-red-500">{`${errorMsg}`}</p>
                  )}
                </div>
              );
            }

            if (field.type === "switch") {
              const checked = watch(field.name as any);
              return (
                <div
                  key={field.name}
                  className="flex items-center space-x-4 rounded-md border p-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.description}
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={checked as boolean}
                    onCheckedChange={(checked) =>
                      setValue(field.name as any, checked as any)
                    }
                  />
                </div>
              );
            }

            if (field.type === "number") {
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type="number"
                    {...register(field.name as any, { valueAsNumber: true })}
                  />
                  {errorMsg && (
                    <p className="text-sm text-red-500">{`${errorMsg}`}</p>
                  )}
                </div>
              );
            }

            if (field.type === "date") {
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    type="date"
                    {...register(field.name as any)}
                  />
                  {errorMsg && (
                    <p className="text-sm text-red-500">{`${errorMsg}`}</p>
                  )}
                </div>
              );
            }

            return null;
          })}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const MemoizedCreateDialogForm = memo(CreateDialogForm);
