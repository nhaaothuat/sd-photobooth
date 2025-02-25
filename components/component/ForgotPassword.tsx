import React from 'react'
import { IconArrowLeft } from '@tabler/icons-react';
import {
     Anchor,
     Box,
     Button,
     Center,
     Container,
     Group,
     Paper,
     Text,
     TextInput,
     Title,
} from '@mantine/core';
import Link from 'next/link';
const ForgotPassword = () => {
     return (
          <div className='flex items-center justify-center min-h-screen'>
               <Container size={460} className="my-10 ">
                    <Title className="text-center text-2xl font-extrabold">Forgot your password?</Title>
                    <Text className="text-center text-sm text-gray-500">Enter your email to get a reset link</Text>

                    <Paper withBorder shadow="md" p={30} radius="md" className="mt-6">
                         <TextInput label="Your email" placeholder="me@mantine.dev" required />
                         <Group justify="space-between" mt="lg" className="flex flex-wrap mt-4">
                              <Anchor c="dimmed" size="sm" className="text-gray-500 text-sm">
                                   <Center inline className="flex items-center">
                                        <IconArrowLeft size={12} stroke={1.5} />
                                        <Link href={"/"}>
                                             Back to the login page</Link>

                                   </Center>
                              </Anchor>
                              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Reset password</Button>
                         </Group>
                    </Paper>
               </Container>
          </div>
     );

}

export default ForgotPassword
