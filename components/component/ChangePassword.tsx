"use client";
import { useState } from 'react';

import { Button, TextInput, Stack } from '@mantine/core';
import AxiosAPI from '@/configs/axios';
import { useToast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AxiosAPI.post('/api/Identity/change-password', {
        currentPassword,
        newPassword,
      });

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: err?.response?.data?.message || 'Đổi mật khẩu thất bại!', // Thay thế t("errorDesc")
      })
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleChangePassword}>
      <Stack>
        <TextInput
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <TextInput
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={loading}>
          Đổi mật khẩu
        </Button>
      </Stack>
    </form>
  )
}

export default ChangePassword
