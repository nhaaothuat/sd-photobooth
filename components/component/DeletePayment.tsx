import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface DeletePaymentProps {
  id: number;
  onDelete: (id: number) => Promise<void>;
}

const DeletePayment: React.FC<DeletePaymentProps> = ({ id, onDelete }) => {
  const [loading, setLoading] = useState(false);
const t = useTranslations("manager");
  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await onDelete(id);
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="border-red-600" asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? "..." : <IconTrash className="border-red-600" size={20} />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSureTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
          {t("areYouSureDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." :  t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePayment;
