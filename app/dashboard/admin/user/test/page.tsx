"use client"
import React, { useState } from 'react';
import {
    IconBuildingBank,
    IconCreditCard,
    IconReceiptRefund,
    IconRepeat,
    IconReceipt,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Card, SimpleGrid, Text, Title, UnstyledButton, useMantineTheme } from '@mantine/core';
import AddUser from '@/components/component/AddUser';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import GPUserLocation from '@/components/component/GPUserLocation';
import GPRoleUser from '@/components/component/GPRoleUser';
import GPUser from '@/components/component/GPUser';
import GPUserBan from '@/components/component/GPUserBan';
// import GpFilter from '@/components/component/GpFilter';

const mockdata = [
    { title: 'Create', icon: IconCreditCard, color: 'violet', component: <AddUser /> },
    // { title: 'Filter', icon: IconBuildingBank, color: 'indigo', component: <GpFilter /> },
    { title: 'Update Status', icon: IconRepeat, color: 'blue', component: <GPUserBan /> },
    { title: 'Get Detail', icon: IconReceiptRefund, color: 'green', component: <GPUser /> },
    { title: 'Change Role', icon: IconReceipt, color: 'teal', component: <GPRoleUser /> },

    { title: 'Move Location', icon: IconReceipt, color: 'teal', component: <GPUserLocation /> },
];

const UserPage = () => {
    const theme = useMantineTheme();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(null);

    const handleButtonClick = (component: React.ReactNode) => {
        setCurrentComponent(component);
        toggle(); // Mở Dialog
    };

    const items = mockdata.map((item) => (
        <UnstyledButton
            key={item.title}
            className="flex flex-col items-center justify-center text-center rounded-md h-[90px] bg-white dark:bg-dark-700 transition-shadow hover:shadow-md hover:scale-105"
            onClick={() => handleButtonClick(item.component)}
        >
            <item.icon color={theme.colors[item.color][6]} size={32} />
            <Text size="xs" mt={2}>{item.title}</Text>
        </UnstyledButton>
    ));

    return (
        <>
            <Title>User</Title>
            <Card withBorder radius="md" className="bg-gray-50 dark:bg-dark-600 p-4">
                <SimpleGrid cols={3} mt="md">
                    {items}
                </SimpleGrid>
            </Card>

            {/* Dialog hiển thị component */}
            <Dialog open={opened} onOpenChange={toggle}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Action</DialogTitle>
                    </DialogHeader>
                    {currentComponent}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserPage;
