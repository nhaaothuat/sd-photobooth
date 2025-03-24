"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "SUCCESS") {
      setMessage("Thanh toán thành công!");
      setTimeout(() => router.replace("/success"), 3000);
    } else if (cancel === "true" || status === "CANCELLED") {
      setMessage("Thanh toán thất bại hoặc bị hủy.");
      setTimeout(() => router.replace("/failed"), 3000);
    }
  }, [status, cancel, router]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p className={status === "success" ? "text-green-500" : "text-red-500"}>
          {message}
        </p>
        <p className="text-gray-500 mt-2">Bạn sẽ được chuyển hướng sau 3 giây...</p>
      </div>
    </div>
  );
};

export default PaymentConfirm;
