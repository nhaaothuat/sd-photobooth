"use client";
import React, { useEffect, useState } from "react";
import { Table, Text, ScrollArea, Group, Badge, UnstyledButton, Center } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";

import cx from "clsx";
import AddCoupon from "@/components/component/AddCoupon";

import DeleteCoupon from "@/components/component/DeleteCoupon";
import GPCoupon from "@/components/component/GPCoupon";

interface Coupon {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  discount: number;
  startDate: string;
  endDate: string;
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

const CouponComponent = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Coupon | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const fetchCoupons = async () => {
    try {
      const response = await AxiosAPI.get<Coupon[]>("https://sdphotobooth.azurewebsites.net/api/Coupon");
      setCoupons(response.data ?? []);
    } catch (err) {
      console.error("Lỗi API:", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const setSorting = (field: keyof Coupon) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const filteredData = coupons.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    return reverseSortDirection
      ? b[sortBy].toString().localeCompare(a[sortBy].toString())
      : a[sortBy].toString().localeCompare(b[sortBy].toString());
  }) : filteredData;

  

  return (
    <div className="space-y-4 p-6">
       <div className='flex items-center justify-between'>
        <h2 className="text-xl font-bold">Danh sách địa điểm</h2>
        <AddCoupon onAddSuccess={fetchCoupons}/>
        <DeleteCoupon onAddSuccess={fetchCoupons}/>
        <GPCoupon onAddSuccess={fetchCoupons}/>
      </div>
      <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} scrollbarSize={6} scrollHideDelay={0}>
        <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", { "shadow-md": scrolled })}>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>Name</Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Discount</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((coupon) => (
                <Table.Tr key={coupon.id}>
                  <Table.Td>{coupon.id}</Table.Td>
                  <Table.Td>{coupon.name}</Table.Td>
                  <Table.Td>{coupon.code}</Table.Td>
                  <Table.Td>{coupon.discount}</Table.Td>
                  <Table.Td>{new Date(coupon.startDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>{new Date(coupon.endDate).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Badge color={coupon.isActive ? "green" : "red"}>{coupon.isActive ? "Active" : "Inactive"}</Badge>
                  </Table.Td>
                  <Table.Td >
                    <Group gap="sm">
                      
                      {/* <IDLocation id={location.id}/>
                      <GPLocation id={location.id} onUpdateSuccess={fetchLocations} locationData={location}/> */}
                    </Group>


                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} align="center">
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

export default CouponComponent;
