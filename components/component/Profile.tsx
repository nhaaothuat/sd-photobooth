import React from 'react'
// import {
//   Card,
//   CardContent,
 
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {Avatar, Text, Group, Stack, Badge } from '@mantine/core';
// import { IconUsers, IconUserPlus, IconPackage, IconMapPin } from '@tabler/icons-react';
// import gru from "@/assets/gru.jpg";
// import Image from 'next/image';
// import { Button } from '../ui/button';
import { Card, Image, Text } from '@mantine/core';

const Profile = () => {
  return (
   


      // <Card className="relative  bg-gradient-to-b from-black to-gray-900 text-white py-3">



      //   {/* Main Image */}
      //   <div className="relative mx-auto  w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-purple-600">
      //     <Image
      //       src={gru}
      //       alt="Profile"
      //       className="w-full h-full object-cover"
      //     />
          

      //   </div>
      //   <CardHeader className="flex items-center ">

      //     <CardTitle className="text-lg font-semibold">Test 1</CardTitle>
      //   </CardHeader>
      //   {/* Info Section */}
      //   <CardContent>
      //     <Stack className="mt-4">
      //       <Group >
      //         <IconUsers size={18} />
      //         <Text>FPT Quy Nhơn - Khu 1</Text>
      //       </Group>
      //       <Group >
      //         <IconUserPlus size={18} />
      //         <Text>Nhân viên</Text>
      //       </Group>
      //       <Group >
      //         <IconPackage size={18} />
      //         <Text>test1@gmail.com</Text>
      //       </Group>

      //       <Group >
      //         <IconMapPin size={18} />
      //         <Text>Bebedouro</Text>
      //       </Group>
      //     </Stack>
      //   </CardContent>



      //   <Button className='my-2 flex items-center justify-betweenv ' variant={"ghost"}>
      //     Edit
      //   </Button>

      // </Card>
      <Card
      shadow="sm"
      padding="xl"
      component="a"
      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      target="_blank"
    >
      <Card.Section>
        <Image
          src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          h={160}
          alt="No way!"
        />
      </Card.Section>

      <Text fw={500} size="lg" mt="md">
        You&apos;ve won a million dollars in cash!
      </Text>

      <Text mt="xs" c="dimmed" size="sm">
        Please click anywhere on this card to claim your reward, this is not a fraud, trust us
      </Text>
    </Card>
   
  )
}

export default Profile
