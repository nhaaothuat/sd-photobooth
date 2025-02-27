"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { signIn } from "next-auth/react";
import fpt from "@/assets/tech-x.png";
import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";
// import { Session } from "./types/session";
import AxiosAPI from "@/configs/axios";

const formSchema = z.object({
  email: z.string().email({ message: "Hãy nhập đúng email" }),
  password: z.string().min(1, { message: "Bạn chưa nhập mật khẩu" }),
});

const Home = () => {
  // const [sessions, setSessions] = useState<Session[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => { };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-2">
        <div className="flex justify-center">
          <Image
            src={fpt}
            alt="FPT Logo"
            width={200}
            height={200}
            className="rounded-md"
          />
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Login with your Google account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Link
                  href="/forget-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>

                <Button
                  type="submit"
                  variant={"destructive"}
                  className="w-full   font-semibold"
                >
                  Login
                </Button>
              </form>

              <div className="relative flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500 bg-white">
                  Or continue with
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => signIn("google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>

              {/* <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={async () => {
                  const response = await AxiosAPI.get("api/TypeSession");
                  const data = (await response.data) as Session[];
                  setSessions(data);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Get Type Session
              </Button> */}
              {/* <ul className="mt-4">
                {sessions && sessions.length > 0 ? (
                  sessions.map((session, index) => (
                    <li key={index} className="p-2 border rounded mb-2">
                      <p className="font-bold">{session.name}</p>
                      <p>{session.description}</p>
                      <p>Thời gian: {session.duration} phút</p>
                      <p>Giá: {session.price} VND</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Không có dữ liệu</p>
                )}
              </ul> */}

            </Form>
          </CardContent>
        </Card>

        <footer className="mt-4 text-center text-sm text-gray-600">
          <Link href="/privacy" className=" hover:underline text-gray-800 ">Privacy Policy</Link>
        </footer>
      </div>
    </div>
  );
};

export default Home;
