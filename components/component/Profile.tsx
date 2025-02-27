import React from 'react'
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Avatar, Text, Group, Stack, Badge } from '@mantine/core';
import { IconUsers, IconUserPlus, IconPackage, IconMapPin } from '@tabler/icons-react';
import gru from "@/assets/gru.jpg";
import Image from 'next/image';
import { Button } from '../ui/button';

const Profile = () => {
  return (
    <div className='pl-4 '>


      <Card className="relative  bg-gradient-to-b from-black to-gray-900 text-white ">



        {/* Main Image */}
        <div className="relative mx-auto  w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-purple-600">
          <Image
            src={gru}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          

        </div>
        <CardHeader className="flex items-center ">

          <CardTitle className="text-lg font-semibold">Test 1</CardTitle>
        </CardHeader>
        {/* Info Section */}
        <CardContent>
          <Stack className="mt-4">
            <Group >
              <IconUsers size={18} />
              <Text>FPT Quy Nhơn - Khu 1</Text>
            </Group>
            <Group >
              <IconUserPlus size={18} />
              <Text>Nhân viên</Text>
            </Group>
            <Group >
              <IconPackage size={18} />
              <Text>test1@gmail.com</Text>
            </Group>

            <Group >
              <IconMapPin size={18} />
              <Text>Bebedouro</Text>
            </Group>
          </Stack>
        </CardContent>



        <Button className='my-2 flex items-center justify-betweenv ' variant={"ghost"}>
          Edit
        </Button>

      </Card>
    </div>
  )
}

export default Profile
