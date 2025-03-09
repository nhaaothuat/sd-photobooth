"use client"
import React, { useEffect, useState } from 'react';
import { Table, Text, ScrollArea, Group, Badge, ActionIcon, Center, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector, IconTrash } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import AddPayment from '@/components/component/AddPayment';
import SearchInput from '@/components/component/SearchInput';
import cx from 'clsx';
import DeletePayment from '@/components/component/DeletePayment';
import { toast } from 'react-toastify';
import GPPayment from '@/components/component/GPPayment';
import IDPaymentMethod from '@/components/component/IDPayment';

interface PaymentMethod {
  id: number;
  methodName: string;
  description: string;
  createdAt: string;
  isActive: boolean;
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
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className="w-[21px] h-[21px] rounded-full">
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof PaymentMethod | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const fetchPaymentMethods = async () => {
    try {
      const response = await AxiosAPI.get<PaymentMethod[]>("api/PaymentMethod");
      setPaymentMethods(response.data ?? []);
    } catch (err) {
      console.error("Lỗi API:", err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const setSorting = (field: keyof PaymentMethod) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const filteredData = paymentMethods.filter((item) =>
    item.methodName.toLowerCase().includes(search.toLowerCase())
  );


  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    return reverseSortDirection
      ? b[sortBy].toString().localeCompare(a[sortBy].toString())
      : a[sortBy].toString().localeCompare(b[sortBy].toString());
  }) : filteredData;

  

  const handleDelete = async (id: number) => {


    try {
      await AxiosAPI.delete(`api/PaymentMethod/${id}`);

      toast.dismiss();
      toast.success(`Payment method deleted successfully!`)
      fetchPaymentMethods();
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="space-y-4 p-6">
      <div className='flex items-center justify-between'>
        <h2 className="text-xl font-bold">Danh sách phương thức thanh toán</h2>
        <AddPayment onAddSuccess={fetchPaymentMethods} />
      </div>
      <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
      <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", { "shadow-md": scrolled })}>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Th sorted={sortBy === 'methodName'} reversed={reverseSortDirection} onSort={() => setSorting('methodName')}>Method</Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((method) => (
                <Table.Tr key={method.id}>
                  <Table.Td>{method.id}</Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <div>
                        <Text fz="sm" fw={500}>{method.methodName}</Text>
                        <Text fz="xs" c="dimmed">{method.description}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{new Date(method.createdAt).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={method.isActive ? "green" : "gray"}
                      variant="light"
                      
                      
                    >
                      {method.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td >
                    <Group gap="sm">
                      <DeletePayment id={method.id} onDelete={handleDelete} />
                      <GPPayment id={method.id} paymentData={method} onUpdateSuccess={fetchPaymentMethods} />
                      <IDPaymentMethod id={method.id} />
                    </Group>


                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
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

export default Payment;
