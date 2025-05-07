"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sessionData, setSessionData] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [cancel, setCancel] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const s = searchParams.get("status");
    const o = searchParams.get("orderCode");
    const c = searchParams.get("cancel");

    setStatus(s);
    setOrderCode(o);
    setCancel(c);
  }, [searchParams]);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderCode || !status) return;

      if (status === "PAID") {
        try {
          const response = await AxiosAPI.post(`/api/Session/${orderCode}`, orderCode);
          if (response.status === 200 || response.status === 201) {
            setMessage("Thanh toán thành công!");
            setSessionData(response.data as any);
            setIsSuccess(true);
          } else {
            setMessage("Lỗi khi xác nhận thanh toán.");
            setTimeout(() => router.replace("/failed"), 3000);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          setMessage("Có lỗi xảy ra trong quá trình xác nhận.");
          setTimeout(() => router.replace("/failed"), 3000);
        }
      } else if (cancel === "true" || status === "CANCELLED") {
        setMessage("Thanh toán thất bại hoặc bị hủy.");
        setTimeout(() => router.replace("/failed"), 3000);
      }
    };

    confirmPayment();
  }, [orderCode, status, cancel, router]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p className={isSuccess ? "text-green-500" : "text-red-500"}>
          {message || "Đang xử lý..."}
        </p>

        {sessionData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold">Thông tin phiên:</h2>
            <pre className="text-sm text-gray-700">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirm;
