"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [cancel, setCancel] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      setOrderCode(searchParams.get("orderCode"));
      setStatus(searchParams.get("status"));
      setCancel(searchParams.get("cancel"));
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p><strong>Order Code:</strong> {orderCode ?? "Không có dữ liệu"}</p>
        <p><strong>Status:</strong> {status ?? "Không có dữ liệu"}</p>
        <p><strong>Cancel:</strong> {cancel ?? "Không có dữ liệu"}</p>
      </div>
    </div>
  );
};

export default PaymentConfirm;
