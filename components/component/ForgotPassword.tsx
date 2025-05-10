"use client"
import React, { useState } from 'react'
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

import AxiosAPI from '@/configs/axios';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
     const [email, setEmail] = useState("");
     const [loading, setLoading] = useState(false);
     const [successMessage, setSuccessMessage] = useState<string | null>(null);
     const {toast} = useToast();
     const handleResetPassword = async () => {
          if (!email) {
             
               toast({
                    className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
                    variant: "destructive",
                    title: "Error", // Thay thế t("errorTitle")
                    description: "Please enter your email", // Thay thế t("errorDesc")
                  })
               return;
          }

          setLoading(true);
          setSuccessMessage(null);
          try {
               const response = await AxiosAPI.post("api/Identity/forgot-password", {
                    email,
               });

               if (response.status === 200) {
                    setSuccessMessage("Reset link sent to your email ✅");
                    setEmail("");
                    
               } else {
                    throw new Error("Failed to send reset link");
               }
          } catch (error: any) {
               console.error("Error:", error);
             
               toast({
                    className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
                    variant: "destructive",
                    title: "Error", // Thay thế t("errorTitle")
                    description: error.response?.data?.message || "Something went wrong", // Thay thế t("errorDesc")
                  })
          }

          setLoading(false);
     };

     return (
          <div className='flex items-center justify-center min-h-screen'>
               <Container size={460} className="my-10 ">
                    <Title className="text-center text-2xl font-extrabold">Forgot your password?</Title>
                    <Text className="text-center text-sm text-gray-500">Enter your email to get a reset link</Text>

                    <Paper withBorder shadow="md" p={30} radius="md" className="mt-6">
                         <TextInput value={email}
                              onChange={(e) => setEmail(e.target.value)} label="Your email" placeholder="me@mantine.dev" required />
                         <Group justify="space-between" mt="lg" className="flex flex-wrap mt-4">
                              <Anchor href='/' c="dimmed" size="sm" className="text-gray-500 text-sm">
                                   <Center inline className="flex items-center">
                                        <IconArrowLeft size={12} stroke={1.5} />
                                        <div>
                                             Back to the login page</div>

                                   </Center>
                              </Anchor>
                              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleResetPassword}
                                   loading={loading}>Reset password</Button>
                         </Group>
                    </Paper>
                    {successMessage && (
                         <Text className="text-green-600 text-sm text-center mt-4">{successMessage}</Text>
                    )}
               </Container>
          </div>
     );

}

export default ForgotPassword
