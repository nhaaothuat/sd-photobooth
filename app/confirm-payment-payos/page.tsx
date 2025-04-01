"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const [orderCode, setOrderCode] = useState("");
  const [status, setStatus] = useState("");
  const [cancel, setCancel] = useState("");

  useEffect(() => {
    setOrderCode(searchParams.get("ordercode") || "");
    setStatus(searchParams.get("status") || "");
    setCancel(searchParams.get("cancel") || "");
  }, [searchParams]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p><strong>Order Code:</strong> {orderCode}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Cancel:</strong> {cancel}</p>
      </div>
    </div>
  );
};

export default PaymentConfirm;
