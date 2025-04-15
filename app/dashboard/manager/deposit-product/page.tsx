"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, ScrollArea, Table ,Group} from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import { DepositProduct } from "@/types/type";
import AddDepositProduct from "@/components/component/AddDepositProduct";
import ViewDetailDepositProduct from "@/components/component/IDDepositProduct";
import DeleteDepositProduct from "@/components/component/DeleteDepositProduct";
import ExportButton from "@/components/component/ButtonExport";


const DepositProductPage = () => {
  const [data, setData] = useState<DepositProduct[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await AxiosAPI.get("/api/DepositProduct");
      setData(res.data as any);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rows = data.map((row) => (
    <Table.Tr key={row.id}>
       <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{row.productId}</Table.Td>
      <Table.Td>{row.amountAdd}</Table.Td>
      <Table.Td>{row.price}</Table.Td>
      <Table.Td>{row.createdAt}</Table.Td>
      <Table.Td>
        <Group>
          <ViewDetailDepositProduct id={row.id}/>
          <DeleteDepositProduct id={row.id} onDeleteSuccess={fetchData}/>
          
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
    <div>
      
      <ExportButton />
    <AddDepositProduct onSuccess={fetchData}/>
    </div>
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      className="rounded-md border border-gray-200"
    >
      <Table miw={700}>
        <Table.Thead
          className={`
            sticky top-0 z-10 bg-white transition-shadow
            ${scrolled ? "shadow-sm" : ""}
          `}
        >
          <Table.Tr>
          <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>description</Table.Th>
            <Table.Th>productId</Table.Th>
            <Table.Th>amountAdd</Table.Th>
            <Table.Th>price</Table.Th>
            <Table.Th>createdAt</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
    </>
  );
}

export default DepositProductPage
