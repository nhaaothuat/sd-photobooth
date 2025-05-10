"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import AxiosAPI from "@/configs/axios";
import { useToast } from "@/hooks/use-toast";

const GPUserBan = () => {
  const [email, setEmail] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateBanStatus = async () => {
    if (!email) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error",
        description: "Email is required.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosAPI.post(
        `api/User/update-ban-status?email=${encodeURIComponent(email)}&isBanned=${isBanned}`,
        {}
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Server update failed.");
      }

      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success",
        description: `User has been successfully ${isBanned ? "banned" : "unbanned"}.`,
      });
    } catch (error: any) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating user status.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardHeader>
        <CardTitle>Update Ban Status</CardTitle>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="ban-switch">Ban User</Label>
            <Switch
              id="ban-switch"
              checked={isBanned}
              onCheckedChange={setIsBanned}
            />
          </div>
          <Button
            onClick={updateBanStatus}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPUserBan;
