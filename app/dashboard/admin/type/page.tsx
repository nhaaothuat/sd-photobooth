"use client";
import React, { useEffect, useState } from "react";
import { Table, Text, ScrollArea, Group, Badge, ActionIcon, Center, UnstyledButton, Modal, TextInput, Switch, Button } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconEdit, IconSelector, IconTrash } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import SearchInput from "@/components/component/SearchInput";
import cx from "clsx";
import DeletePayment from "@/components/component/DeletePayment";
import { toast } from "react-toastify";
import GPTypeSession from "@/components/component/GPTypeSession";
import { useSession } from "next-auth/react";
import AddTypeSession from "@/components/component/AddTypeSession";
import IDTypeSession from "@/components/component/IDTypeSession";

interface TypeSessionProps {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  isPrinting: boolean;
  ableTakenNumber: number;
  createdAt: string;
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

const TypeSession = () => {
  const { data: session } = useSession();
  const [typeSessions, setTypeSessions] = useState<TypeSessionProps[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof TypeSessionProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);



  const fetchTypeSessions = async () => {
    try {
      const response = await AxiosAPI.get<TypeSessionProps[]>("api/TypeSession");
      
      setTypeSessions(response.data ?? []);
    } catch (err) {
      console.error("Lỗi API:", err);
      toast.error("Failed to fetch type sessions");
    }
  };

  useEffect(() => {
    if (session?.user?.role === "Admin") {
      fetchTypeSessions();
    }
  }, [session]);



  const setSorting = (field: keyof TypeSessionProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const filteredData = typeSessions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    return reverseSortDirection
      ? b[sortBy].toString().localeCompare(a[sortBy].toString())
      : a[sortBy].toString().localeCompare(b[sortBy].toString());
  }) : filteredData;

  const handleDelete = async (id: number) => {


    try {
      await AxiosAPI.delete(`api/TypeSession/${id}`);

      toast.dismiss();
      toast.success(`Payment method deleted successfully!`)
      fetchTypeSessions();
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };





  return (
    <div className="space-y-4 p-6">
      <div className='flex items-center justify-between'>
        <h2 className="text-xl font-bold">Danh sách loại phiên</h2>
        <AddTypeSession onAddSuccess={fetchTypeSessions} />
      </div>
      <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
      <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", { "shadow-md": scrolled })}>
            <Table.Tr>
              <Table.Th className="w-[50px]">ID</Table.Th>
              <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>Name</Th>
              {/* <Table.Th>Description</Table.Th> */}
              <Table.Th>Duration</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Printing</Table.Th>
              <Table.Th>Available Numbers</Table.Th>
              {/* <Table.Th>Created At</Table.Th> */}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((session) => (
                <Table.Tr key={session.id}>
                  <Table.Td>{session.id}</Table.Td>
                  <Table.Td>{session.name}</Table.Td>
                  {/* <Table.Td>{session.description}</Table.Td> */}
                  <Table.Td>{session.duration} mins</Table.Td>
                  <Table.Td>${session.price}</Table.Td>
                  <Table.Td>
                    <Badge color={session.isPrinting ? "green" : "gray"} variant="light">
                      {session.isPrinting ? "Yes" : "No"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{session.ableTakenNumber}</Table.Td>
                  {/* <Table.Td>{new Date(session.createdAt).toLocaleDateString()}</Table.Td> */}
                  <Table.Td>
                    <Group gap="sm">
                      <DeletePayment id={session.id} onDelete={handleDelete} />
                      <GPTypeSession id={session.id} typeSessionData={session} onUpdateSuccess={fetchTypeSessions} />
                      <IDTypeSession id={session.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9} align="center">
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

export default TypeSession;
