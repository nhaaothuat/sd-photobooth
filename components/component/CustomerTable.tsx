"use client"

import Title from "./Title"
import { useState } from 'react';
import cx from 'clsx';
import { ScrollArea, Table } from '@mantine/core';
import { data } from "@/providers/data_table"
const CustomerTable = () => {
     const [scrolled, setScrolled] = useState(false);

     const rows = data.map((row) => (
          <Table.Tr key={row.name}>
               <Table.Td>{row.name}</Table.Td>
               <Table.Td>{row.email}</Table.Td>
               <Table.Td>{row.company}</Table.Td>
          </Table.Tr>
     ));
     return (
          <ScrollArea h={450} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
               <Table miw={700}>
                    <Table.Thead
                         className={cx(
                              "sticky top-0 bg-white dark:bg-gray-900 transition-shadow",
                              { "shadow-md": scrolled }
                         )}
                    >
                         <Table.Tr>
                              <Table.Th>Name</Table.Th>
                              <Table.Th>Email</Table.Th>
                              <Table.Th>Company</Table.Th>
                         </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
               </Table>
          </ScrollArea>
     )
}

export default CustomerTable
