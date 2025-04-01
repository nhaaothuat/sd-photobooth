"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";

const PaymentConfirm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel");
  const orderCode = searchParams.get("ordercode");

  const [message, setMessage] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (status === "SUCCESS" && orderCode) {
        try {
          const response = await AxiosAPI.post<{ orderCode: string }>(
            `/api/Session/${orderCode}`,
            { orderCode }
          );

          if (response.status === 200 || response.status === 201) {
            setMessage("Thanh toán thành công!");
            console.log("Thông tin phiên:", response.data);
            setSessionData(response.data); // Lưu thông tin session để hiển thị
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
  }, [status, orderCode, cancel, router]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p className={status === "SUCCESS" ? "text-green-500" : "text-red-500"}>
          {message}
        </p>

        {/* Hiển thị thông tin session sau khi thanh toán thành công */}
        {sessionData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold">Thông tin phiên:</h2>
            <pre className="text-sm text-gray-700">{JSON.stringify(sessionData, null, 2)}</pre>
          </div>
        )}

        <p className="text-gray-500 mt-2">Bạn sẽ được chuyển hướng sau 3 giây...</p>
      </div>
    </div>
  );
};

export default PaymentConfirm;
