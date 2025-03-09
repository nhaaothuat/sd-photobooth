"use client"
import React, { useEffect, useState } from 'react';
import { Table, Text, ScrollArea, Group, Badge, UnstyledButton, Center } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import SearchInput from '@/components/component/SearchInput';
import cx from 'clsx';
import AddLocation from '@/components/component/AddLocation';
import DeletePayment from '@/components/component/DeletePayment';
import { toast } from 'react-toastify';
import IDLocation from '@/components/component/IDLocation';

interface Location {
  id: number;
  locationName: string;
  address: string;
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

const LocationComponent = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Location | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const fetchLocations = async () => {
    try {
      const response = await AxiosAPI.get<Location[]>("https://sdphotobooth.azurewebsites.net/api/Location");
      setLocations(response.data ?? []);
    } catch (err) {
      console.error("Lỗi API:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const setSorting = (field: keyof Location) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const filteredData = locations.filter((item) =>
    item.locationName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    return reverseSortDirection
      ? b[sortBy].toString().localeCompare(a[sortBy].toString())
      : a[sortBy].toString().localeCompare(b[sortBy].toString());
  }) : filteredData;

  const handleDelete = async (id: number) => {
  
  
      try {
        await AxiosAPI.delete(`api/Location/${id}`);
  
        toast.dismiss();
        toast.success(`Location method deleted successfully!`)
        fetchLocations()
      } catch (err: any) {
        console.error("Delete Error:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    };

  return (
    <div className="space-y-4 p-6">
      <div className='flex items-center justify-between'>
        <h2 className="text-xl font-bold">Danh sách địa điểm</h2>
        <AddLocation onAddSuccess={fetchLocations}/>
      </div>
      <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
      <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", { "shadow-md": scrolled })}>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Th sorted={sortBy === 'locationName'} reversed={reverseSortDirection} onSort={() => setSorting('locationName')}>Location Name</Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((location) => (
                <Table.Tr key={location.id}>
                  <Table.Td>{location.id}</Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Text fz="sm" fw={500}>{location.locationName}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{location.address}</Table.Td>
                  <Table.Td>{new Date(location.createdAt).toLocaleDateString()}</Table.Td>
                  <Table.Td >
                    <Group gap="sm">
                      <DeletePayment id={location.id} onDelete={handleDelete} />
                      <IDLocation id={location.id}/>
                    </Group>


                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
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

export default LocationComponent;