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

import { signIn, useSession } from "next-auth/react";
import fpt from "@/assets/tech-x.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AxiosAPI from "@/configs/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";



const formSchema = z.object({
  email: z.string().email({ message: "Hãy nhập đúng email" }),
  password: z.string().min(1, { message: "Bạn chưa nhập mật khẩu" }),

});

const Home = () => {
  const { data: session, update } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role) {
      switch (session.user.role) {
        case "Admin":
          router.replace("/dashboard/admin");
          break;
        case "Manager":
          router.replace("/dashboard/manager");
          break;
        case "Staff":
          router.replace("/dashboard/staff");
          break;
        default:
          router.replace("/dashboard");
      }
    }
  }, [session, router]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });


  // const handleSubmit = async (data: z.infer<typeof formSchema>) => {

  //   try {
  //     const response = await AxiosAPI.post(
  //       "api/Identity/login", data
  //     );

  //     const result = response.data as any;

  //     if (result.token) {



  //       Cookies.set("AccessToken", result.token, { expires: 1, path: "/" });



  //       toast.success("Đăng nhập thành công!");

  //       const decodedToken = JSON.parse(atob(result.token.split(".")[1]));
  //       const user = {
  //         id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "",
  //         name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
  //         email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"] || "",
  //         role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "guest",
  //       };

  //       console.log("Updating session with:", user);

  //       // Cập nhật session trong NextAuth
  //       await update({ user });


  //       switch (user.role) {
  //         case "Admin":
  //           router.replace("/dashboard/admin");
  //           break;
  //         case "Manager":
  //           router.replace("/dashboard/manager");
  //           break;
  //         case "Staff":
  //           router.replace("/dashboard/staff");
  //           break;
  //         default:
  //           router.replace("/dashboard");
  //       }
  //     } else {
  //       toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   }
  // };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try{
      console.log(data,"h")
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Không reload trang
      });
  
      console.log(result);
  
      if (result?.error) {
        toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
      }
      const updatedSession = await update();
      console.log("Updated Session:", updatedSession);
  
  
      switch (updatedSession?.user?.role) {
        case "Admin":
          router.replace("/dashboard/admin");
          break;
        case "Manager":
          router.replace("/dashboard/manager");
          break;
        case "Staff":
          router.replace("/dashboard/staff");
          break;
        default:
          router.replace("/dashboard");
      }
  
    }catch(error){
      console.error("🔴 Lỗi khi đăng nhập:", error);
    toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
    }
    
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center h-[300px]  p-6 md:p-10">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />

      </video>
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-2 min-h-screen">


        <div className="absolute inset-0 flex items-center justify-center">


          <Card className="shadow-xl w-full max-w-sm ">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center">
                <Image
                  src={fpt}
                  alt="FPT Logo"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>

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
                    className="w-full font-semibold"
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
                  onClick={async () => signIn("google", { redirectTo: "/" })}
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
              </Form>
            </CardContent>
          </Card>
        </div>
        <footer className="mt-4 text-center text-sm text-gray-600 ">
          <Link href="/privacy" className=" hover:underline text-gray-800 mx-2">
            Privacy Policy
          </Link>
          <Link href="/about" className=" hover:underline text-gray-800 ">
            About Us
          </Link>
        </footer>
      </div>
    </div>





  );
};

export default Home; 