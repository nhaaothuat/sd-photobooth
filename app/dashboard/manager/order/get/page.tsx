"use client";
import React, { useEffect, useState } from "react";
import { Table, Text, ScrollArea, Group, Badge, UnstyledButton, Center } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import SearchInput from "@/components/component/SearchInput";
import cx from "clsx";
import DeletePayment from "@/components/component/DeletePayment";
import { toast } from "react-toastify";
import IDOrder from "@/components/component/IDOrder";
import GPOrder from "@/components/component/GPOrder";

interface Order {
     id: number;
     status: number;
     email: string | null;
     createdAt: string;
     paymentMethod: { methodName: string } | null;

}

interface ThProps {
     children: React.ReactNode;
     reversed: boolean;
     sorted: boolean;
     onSort: () => void;
}
const orderStatusMap: Record<number, { label: string; color: string }> = {
     0: { label: "None", color: "gray" },
     1: { label: "Pending", color: "yellow" },
     2: { label: "Processing", color: "blue" },
     3: { label: "Completed", color: "green" },
     4: { label: "Failed", color: "red" },
     5: { label: "Cancelled", color: "pink" },
   };
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

const ListOrder = () => {
     const [orders, setOrders] = useState<Order[]>([]);
     const [search, setSearch] = useState("");
     const [sortBy, setSortBy] = useState<keyof Order | null>(null);
     const [reverseSortDirection, setReverseSortDirection] = useState(false);
     const [scrolled, setScrolled] = useState(false);

     const fetchOrders = async () => {
          try {
               const response = await AxiosAPI.get<Order[]>("api/Order");
               setOrders(response.data ?? []);
          } catch (err) {
               console.error("Lỗi API:", err);
          }
     };

     useEffect(() => {
          fetchOrders();
     }, []);

     const setSorting = (field: keyof Order) => {
          const reversed = field === sortBy ? !reverseSortDirection : false;
          setReverseSortDirection(reversed);
          setSortBy(field);
     };

     const filteredData = orders.filter((order) =>
          (order.email ?? "").toLowerCase().includes(search.toLowerCase())
     );

     const sortedData = sortBy
          ? [...filteredData].sort((a, b) =>
               reverseSortDirection
                    ? (b[sortBy] ?? "").toString().localeCompare((a[sortBy] ?? "").toString())
                    : (a[sortBy] ?? "").toString().localeCompare((b[sortBy] ?? "").toString())
          )
          : filteredData;

     const handleDelete = async (id: number) => {
          try {
               await AxiosAPI.delete(`api/Order/${id}`);
               toast.dismiss();
               toast.success(`Order deleted successfully!`);
               fetchOrders();
          } catch (err: any) {
               console.error("Delete Error:", err);
               toast.error(err.response?.data?.message || "Something went wrong");
          }
     };

     return (
          <div className="space-y-4 p-6">
               <h2 className="text-xl font-bold">Danh sách đơn hàng</h2>
               <SearchInput search={search} onSearchChange={(e) => setSearch(e.currentTarget.value)} />
               <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} scrollbarSize={6} scrollHideDelay={0}>
                    <Table striped withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                         <Table.Thead className={cx("sticky top-0 bg-white dark:bg-gray-900 transition-shadow", { "shadow-md": scrolled })}>
                              <Table.Tr>
                                   <Table.Th className="w-[175px]">ID</Table.Th>
                                   <Th sorted={sortBy === "status"} reversed={reverseSortDirection} onSort={() => setSorting("status")}>Status</Th>
                                   <Table.Th className="w-[300px]">Email</Table.Th>
                                   <Th sorted={sortBy === "createdAt"} reversed={reverseSortDirection} onSort={() => setSorting("createdAt")}>Created At</Th>
                                   <Table.Th>Payment Method</Table.Th>
                                   <Table.Th>Action</Table.Th>
                              </Table.Tr>
                         </Table.Thead>
                         <Table.Tbody>
                              {sortedData.length > 0 ? (
                                   sortedData.map((order) => (
                                        <Table.Tr key={order.id}>
                                             <Table.Td>{order.id}</Table.Td>
                                             <Table.Td className="w-[100px]">
                                                  <Badge color={orderStatusMap[order.status]?.color} variant="light">
                                                       {orderStatusMap[order.status]?.label ?? "Unknown"}
                                                  </Badge>
                                             </Table.Td>
                                             <Table.Td>{order.email ?? "N/A"}</Table.Td>
                                             <Table.Td>{new Date(order.createdAt).toLocaleDateString()}</Table.Td>
                                             <Table.Td>{order.paymentMethod?.methodName ?? "N/A"}</Table.Td>
                                             <Table.Td>
                                                  <Group gap="sm">
                                                       <DeletePayment id={order.id} onDelete={handleDelete} />
                                                       <IDOrder id={order.id}/>
                                                       <GPOrder orderId={order.id} initialStatus={order.status} onUpdateSuccess={fetchOrders}/>
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

export default ListOrder;
