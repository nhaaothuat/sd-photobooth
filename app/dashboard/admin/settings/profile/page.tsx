
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import AxiosAPI from "@/configs/axios";

interface User {
  id: string;
  fullName: string | null;
  userName: string;
  email: string;
  phoneNumber: string;
  gender: number;
  birthDate: string | null;
  avatar: string | null;
}

const GeneralPage = () => {
  const { data: session } = useSession();
  const [users, setUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await AxiosAPI.get<User>("/api/Identity/profile");
      console.log(response.data);
      // setUser(response.data);
    } catch (err) {
      console.error("Lỗi API:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {users && (
          <>
            <Card className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={users.avatar || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />

                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <Text className="font-sans font-semibold">
                    {" "}
                    {session?.user?.name}
                  </Text>
                  <Text className="font-sans font-normal text-slate-400">
                    {" "}
                    {session?.user?.role} | {users.email}
                  </Text>
                </div>
              </div>

              <Button
                variant="outline"
                size={"lg"}
                className="flex items-center  "
              >
                <Pencil className="w-10 h-10" />
              </Button>
            </Card>

            <Card className=" my-5">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between ">
                  <div className="flex items-center  gap-20">
                    <div>
                      <Text
                        className="font-sans font-semibold text-gray-500"
                        size="lg"
                      >
                        Full Name
                      </Text>
                      <Text className="font-sans font-medium" size="sm">
                        {users.fullName || "N/A"}
                      </Text>
                    </div>

                    <div>
                      <Text
                        className="font-sans font-semibold text-gray-500"
                        size="lg"
                      >
                        Phone Number
                      </Text>
                      <Text className="font-sans font-medium" size="sm">
                        {users.phoneNumber || "N/A"}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="py-10">
                  <Text
                    className="font-sans font-semibold text-gray-500"
                    size="lg"
                  >
                    Gender
                  </Text>
                  <Text className="font-sans font-medium" size="sm">
                    {" "}
                    {users.gender === 0
                      ? "Nam"
                      : users.gender === 1
                      ? "Nữ"
                      : "Other"}
                  </Text>
                </div>
                <div className="pt-2">
                  <Text
                    className="font-sans font-semibold text-gray-500"
                    size="lg"
                  >
                    Birth Date
                  </Text>
                  <Text className="font-sans font-medium" size="sm">
                    {users.birthDate || "N/A"}
                  </Text>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralPage;
