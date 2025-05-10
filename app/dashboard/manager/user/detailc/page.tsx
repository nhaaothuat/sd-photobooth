"use client";
import React, { useState } from "react";
import { TextInput, Button, Alert, Loader, Paper, Title, Text, Stack, Group } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import AxiosAPI from "@/configs/axios";
import { User } from "@/types/type";

const ViewDetailCustomerStaff = () => {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchCustomer = async () => {
    setLoading(true);
    setError("");
    setCustomer(null);

    try {
      const response = await AxiosAPI.get<User>(
        `/api/User/detail?email=${encodeURIComponent(email)}`
      );

      if (!response.data || !response.data.id) {
        throw new Error("NOT_FOUND");
      }

      setCustomer(response.data);
    } catch (err: any) {
      if (err.message === "NOT_FOUND" || err.response?.status === 404) {
        setError("Customer not found.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access this information.");
      } else if (err.response?.status === 400) {
        setError("Invalid email address.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="md" radius="md" p="lg" withBorder maw={600} mx="auto">
      <Title order={3} mb="md">Customer Lookup</Title>

      <Group align="flex-start" gap="sm" mb="md">
        <TextInput
          placeholder="Enter customer email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleFetchCustomer}
          disabled={loading || !email}
          loading={loading}
        >
          Search
        </Button>
      </Group>

      {loading && <Loader size="sm" />}

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}

      {!error && customer && (
        <Stack gap="xs" mt="md">
          <Text><strong>ID:</strong> {customer.id}</Text>
          <Text><strong>Full Name:</strong> {customer.fullName || "N/A"}</Text>
          <Text><strong>Username:</strong> {customer.userName}</Text>
          <Text><strong>Email:</strong> {customer.email}</Text>
          <Text><strong>Phone Number:</strong> {customer.phoneNumber || "N/A"}</Text>
          <Text>
            <strong>Gender:</strong>{" "}
            {customer.gender === 0 ? "Male" : customer.gender === 1 ? "Female" : "Other"}
          </Text>
          <Text><strong>Date of Birth:</strong> {customer.birthDate || "N/A"}</Text>
          <Text><strong>Role:</strong> {customer.role}</Text>
          <Text>
            <strong>Status:</strong>{" "}
            {customer.isBanned ? "Inactive (Banned)" : "Active"}
          </Text>
        </Stack>
      )}
    </Paper>
  );
};

export default ViewDetailCustomerStaff;
