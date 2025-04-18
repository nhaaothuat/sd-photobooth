import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  TextInput,
  Select,
  Stack,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";
import { LevelMembership } from "@/types/type";

const GPUpgradeLevel = ({ onUpdateSuccess }: { onUpdateSuccess: () => void }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState<LevelMembership[]>([]);
  const [form, setForm] = useState({
    id: "",
    levelId: "",
  });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        const res = await AxiosAPI.get<LevelMembership[]>("/api/LevelMemberShip");
        if (res.data && Array.isArray(res.data)) {
          setLevels(res.data.sort((a, b) => a.point - b.point));
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        toast.error("Không thể tải danh sách cấp độ thành viên");
        console.error("Error fetching levels:", err);
      } finally {
        setLoading(false);
      }
    };

    if (opened) {
      fetchLevels();
    }
  }, [opened]);

  const resetForm = () => {
    setForm({
      id: "",
      levelId: "",
    });
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  const handleSubmit = async () => {
    const userId = form.id.trim();
    const levelId = form.levelId;

    if (!userId) {
      toast.error("Vui lòng nhập ID người dùng");
      return;
    }

    if (!levelId) {
      toast.error("Vui lòng chọn cấp độ mới");
      return;
    }

    const userIdNumber = parseInt(userId);
    const levelIdNumber = parseInt(levelId);
    
    if (isNaN(userIdNumber)) {
      toast.error("ID người dùng phải là số");
      return;
    }

    if (isNaN(levelIdNumber)) {
      toast.error("ID cấp độ không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      await AxiosAPI.put(
        `/api/MembershipCard/upgrade-level/${userIdNumber}?levelId=${levelIdNumber}`,
        {}
      );
      toast.success("Nâng cấp thành viên thành công!");
      handleClose();
      onUpdateSuccess(); // Gọi callback khi thành công
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi nâng cấp thành viên";
      toast.error(errorMessage);
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={open}>Nâng cấp thành viên</Button>

      <Modal opened={opened} onClose={handleClose} title="Nâng cấp thành viên" centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Stack>
          <TextInput
            label="ID người dùng"
            placeholder="Nhập ID (phải là số)"
            value={form.id}
            onChange={(e) => {
              const value = e.currentTarget.value.replace(/\D/g, '');
              setForm({ ...form, id: value });
            }}
            required
          />
          <Select
            label="Cấp độ mới"
            placeholder="Chọn cấp độ"
            data={levels.map((level) => ({
              value: level.id.toString(),
              label: `${level.name} (Yêu cầu: ${level.point} điểm)`,
            }))}
            value={form.levelId}
            onChange={(value) => setForm({ ...form, levelId: value || "" })}
            required
            disabled={loading || levels.length === 0}
            nothingFoundMessage="Không có dữ liệu"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !form.id.trim() || !form.levelId}
            >
              Xác nhận nâng cấp
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GPUpgradeLevel;