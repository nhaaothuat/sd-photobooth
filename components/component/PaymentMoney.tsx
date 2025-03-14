"use client"
import React from 'react'
import { Button, Paper, Text, Title, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
const PaymentMoney = () => {
     const [opened, { open, close }] = useDisclosure(false);
     return (
          <Paper
               shadow="md"
               p="xl"
               radius="md"
               className="w-[330px] h-[440px] flex flex-col justify-between items-start bg-cover bg-center"
               style={{
                    background: "black"
               }}
          >
               <div>
                    <Text className="text-white opacity-70 font-bold uppercase text-xs">
                         Money
                    </Text>
                    <Title
                         order={3}
                         className="font-extrabold text-white leading-tight text-2xl mt-2"
                    >
                         Best forests to visit in North America
                    </Title>
               </div>
               <Modal opened={opened} onClose={close} title="Authentication">
                    {/* Modal content */}
               </Modal>

               <Button variant="default" onClick={open}>
                    Open modal
               </Button>
          </Paper>
     )
}

export default PaymentMoney
