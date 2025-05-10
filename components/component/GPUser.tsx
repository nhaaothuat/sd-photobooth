import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import AxiosAPI from "@/configs/axios";
import { useToast } from "@/hooks/use-toast";

interface User {
  fullName: string | null;
  userName: string;
  phoneNumber: string;
  role: string;
  location: {
    locationName: string;
  };
}

const GPUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();
  const fetchUserDetails = async () => {
    if (!email) return;
    setLoading(true);
    setNotFound(false);
    setUser(null); // Đảm bảo user bị xóa trước khi tải lại

    try {
      const response = await AxiosAPI.get<User>(`api/User/detail?email=${encodeURIComponent(email)}`);
      setUser(response.data);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setNotFound(true);
          toast({
            className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
            variant: "destructive",
            title: "Error", // Thay thế t("errorTitle")
            description: "An error occurred", // Thay thế t("errorDesc")
          })
        } else if (error.response.status === 500) {
          toast({
            className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
            variant: "destructive",
            title: "Error", // Thay thế t("errorTitle")
            description: "An error occurred", // Thay thế t("errorDesc")
          })
        } else {
          toast({
            className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
            variant: "destructive",
            title: "Error", // Thay thế t("errorTitle")
            description: "An error occurred", // Thay thế t("errorDesc")
          })
        }
      } else {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          variant: "destructive",
          title: "Error", // Thay thế t("errorTitle")
          description: "An error occurred", // Thay thế t("errorDesc")
        })
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button onClick={fetchUserDetails} disabled={loading} className="w-full">
            {loading ? "Loading..." : "Search"}
          </Button>
          {notFound && <p className="text-red-500 text-center">No results found.</p>}
          {user && !notFound && (
            <div className="mt-4 border p-4 rounded-lg">
              <p><strong>Full Name:</strong> {user.fullName || "No information available"}</p>
              <p><strong>Username:</strong> {user.userName}</p>
              <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Location:</strong> {user.location?.locationName || "No information available"}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

  );
};

export default GPUser;
