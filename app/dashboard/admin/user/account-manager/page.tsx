"use client"
import React, { useEffect, useState } from 'react';
import { Table, Text, ScrollArea, Badge } from "@mantine/core";
import AxiosAPI from "@/configs/axios";

interface User {
  id: string;
  fullName: string | null;
  userName: string;
  email: string;
  phoneNumber: string;
  gender: number;
  role: string;
}

const AccountPageManager = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await AxiosAPI.get<User[]>("/api/User");
      const userData = response.data ?? [];
      const filteredUsers = userData.filter(user => user.role === "Manager");
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Lỗi API:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Danh sách tài khoản</h2>
      <ScrollArea h={450} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Full Name</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone Number</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Role</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.fullName ?? "N/A"}</Table.Td>
                  <Table.Td>{user.userName}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.phoneNumber}</Table.Td>
                  <Table.Td>
                    <Badge color={user.gender === 0 ? "blue" : user.gender === 1 ? "pink" : "gray"}>
                      {user.gender === 0 ? "Nam" : user.gender === 1 ? "Nữ" : "Khác"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green">{user.role}</Badge>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  <Text fw={500} ta="center">Không có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default AccountPageManager;
