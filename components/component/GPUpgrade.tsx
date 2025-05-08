import { useState } from "react";
import {
  Button,
  Modal,
  TextInput,
  Stack,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import AxiosAPI from "@/configs/axios";
import { GrUpgrade } from "react-icons/gr";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

const GPUpgradeLevel = ({ onUpdateSuccess }: { onUpdateSuccess: () => void }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const t = useTranslations("staff");
  const a = useTranslations("toast");
  const { toast } = useToast()
  const handleClose = () => {
    setEmail("");
    close();
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Email is required",
        description: a("errorDesc"),
      });
      return;
    }

    setLoading(true);

    try {
      const res = await AxiosAPI.put("/api/MembershipCard/upgrade-level", {
        email: trimmedEmail,
      });
      if (res.status == 400 || res.status == 404) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          variant: "destructive",
          title: "Error",
          description: "Your information is incorrect or information cannot be found.",
        });
      } else {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
          title: a("successTitle"),
          description: a("successDesc"),
        });
      }



      handleClose();
      onUpdateSuccess();
    } catch (err: any) {
      let errorTitle = a("errorTitle");
      let errorDescription = a("errorDesc");

      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 400) {
          errorTitle = message || "Invalid request";
        } else if (status === 404) {
          errorTitle = "Email không tồn tại";
          errorDescription = "Vui lòng kiểm tra lại email.";
        } else {
          errorDescription = message || errorDescription;
        }
      } else if (err.request) {
        errorTitle = "Network Error";
        errorDescription = "Please check your internet connection";
      } else {
        errorTitle = "Request Error";
        errorDescription = err.message;
      }

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
      });


      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button variant="default" className="border-yellow-500" onClick={open}><GrUpgrade /></Button>

      <Modal opened={opened} onClose={handleClose} title={t("upgradeMember")} centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack>
          <TextInput
            label={t("customerEmail")}
            placeholder={t("enterUserEmail")}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !email.trim()}
            >
              {t("confirmUpgrade")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GPUpgradeLevel;
