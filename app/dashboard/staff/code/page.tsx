"use client";
import React, { useEffect, useState } from "react";
import { Table, Text, ScrollArea, Group, ActionIcon, Center, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector, IconTrash } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import { toast } from "react-toastify";
import SearchInput from "@/components/component/SearchInput";
import { Button } from "@/components/ui/button";
import cx from "clsx";
import DeletePayment from "@/components/component/DeletePayment";
import AddSession from "@/components/component/AddSession";

interface Session {
  code: string;
  expired: string;
  isActive: boolean;
  booth: {
    boothName: string;
  };
  order: {
    id: number;
  } | null;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className="p-0">
      <UnstyledButton onClick={onSort} className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
        <Group justify="space-between">
          <Text fw={500} fz="sm">{children}</Text>
          <Center className="w-[21px] h-[21px] rounded-full">
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

const SessionCode = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Session | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const fetchSessions = async () => {
    try {
      const response = await AxiosAPI.get<Session[]>("api/Session");
      setSessions(response.data ?? []);
    } catch (err) {
      console.error("Lỗi API:", err);
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const setSorting = (field: keyof Session) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const filteredData = sessions.filter((item) =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
     return reverseSortDirection
       ? (b[sortBy]?.toString() ?? "").localeCompare(a[sortBy]?.toString() ?? "")
       : (a[sortBy]?.toString() ?? "").localeCompare(b[sortBy]?.toString() ?? "");
   }) : filteredData;

 
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Session Code</h2>
        {/* <AddSession onAddSuccess={fetchPaymentMethods} /> */}
      </div>
      <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
      <ScrollArea h={450} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className="sticky top-0 bg-white dark:bg-gray-900 transition-shadow">
            <Table.Tr>
              <Th sorted={sortBy === "code"} reversed={reverseSortDirection} onSort={() => setSorting("code")}>Code</Th>
              <Th sorted={sortBy === "expired"} reversed={reverseSortDirection} onSort={() => setSorting("expired")}>Expired</Th>
              <Th sorted={sortBy === "isActive"} reversed={reverseSortDirection} onSort={() => setSorting("isActive")}>Active</Th>
              <Table.Th >Booth Name</Table.Th>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((session, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{session.code}</Table.Td>
                  <Table.Td>{new Date(session.expired).toLocaleString()}</Table.Td>
                  <Table.Td>
                    <span className={`px-2 py-1 rounded text-white ${session.isActive ? "bg-green-500" : "bg-red-500"}`}>
                      {session.isActive ? "Active" : "Inactive"}
                    </span>
                  </Table.Td>
                  <Table.Td>{session.booth.boothName}</Table.Td>
                  <Table.Td>{session.order ? session.order.id : "N/A"}</Table.Td>
                  <Table.Td>
                  <Group gap="sm">
                      
                    </Group>
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

export default SessionCode;
