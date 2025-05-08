import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Checkbox,
  Stack,
  Group,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AxiosAPI from "@/configs/axios";


import { LevelMembership, MembershipCard } from "@/types/type";
import { CiCreditCard2 } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

const EditMembershipCard = ({ id, onUpdated }: { id: number; onUpdated?: () => void }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState<LevelMembership[]>([]);
  const t = useTranslations("staff");
  const a = useTranslations("toast");
  const { toast } = useToast();
  const [form, setForm] = useState({
    levelMemberShipId: 0,
    description: "",
    points: 0,
    isActive: false,
  });


  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await AxiosAPI.get<LevelMembership[]>("/api/LevelMemberShip");
        setLevels(res.data as any);
      } catch (err) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
          variant: "destructive",
          title: a("errorTitle"),
          description: a("errorDesc"),
  
        })
        console.error(err);
      }
    };

    fetchLevels();
  }, []);


  useEffect(() => {
    if (!opened) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<MembershipCard>(`/api/MembershipCard/${id}`);
        const data = res.data;

        setForm({
          levelMemberShipId: data?.levelMemberShip?.id ?? 0,
          description: data?.description ?? "",
          points: data?.points ?? 0,
          isActive: data?.isActive ?? true,
        });
      } catch (err) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
          variant: "destructive",
          title: a("errorTitle"),
          description: a("errorDesc"),
  
        })
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [opened, id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await AxiosAPI.put(`/api/MembershipCard/${id}`, form);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: a("successTitle"),
        description: a("successDesc"),
      })
      close();
      onUpdated?.();
    } catch (error) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
        variant: "destructive",
        title: a("errorTitle"),
        description: a("errorDesc"),

      })
      
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field === 'levelMemberShipId'
        ? parseInt(value || "0")
        : value
    }));
  };

  return (
    <>
      <Button variant="default" onClick={open}>
        <CiCreditCard2 />
      </Button>

      <Modal opened={opened} onClose={close} title={t("editTitle")} centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack gap="sm">
          <Select
            label={t("level")}
            placeholder={t("selectLevel")}
            data={levels.map((level) => ({
              value: level.id.toString(),
              label: level.name,
            }))}
            value={form.levelMemberShipId.toString()}
            onChange={(value) => handleFormChange('levelMemberShipId', value)}
          />
          <TextInput
            label={t("description")}
            placeholder={t("enterDescription")}
            value={form.description}
            onChange={(e) => handleFormChange('description', e.currentTarget.value)}
          />
          <NumberInput
            label={t("points")}
            value={form.points}
            onChange={(val) => handleFormChange('points', val)}
          />
          <Checkbox
            label={t("isActive")}
            checked={form.isActive}
            onChange={(e) => handleFormChange('isActive', e.currentTarget.checked)}
          />
          <Group mt="md" justify="flex-end">
            <Button variant="outline" onClick={close}>
              {t("cancel")}
            </Button>
            <Button onClick={handleUpdate} loading={loading}>
              {t("update")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default EditMembershipCard;