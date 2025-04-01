"use client";

import { useEffect, useState } from "react";
import AxiosAPI from "@/configs/axios";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("Đang xử lý...");
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const storedOrderCode = sessionStorage.getItem("orderCode");

      if (storedOrderCode) {
        setOrderCode(storedOrderCode);
        try {
          const response = await AxiosAPI.post<{ orderCode: string }>(
            `/api/Session/${storedOrderCode}`,
            { orderCode: storedOrderCode }
          );
  console.log("Thông tin phiên:", response.data?.orderCode); // Log thông tin phiên để kiểm tra
          if (response.status === 200 || response.status === 201) {
            setMessage("Phiên giao dịch đã được xác nhận thành công!");
          } else {
            setMessage("Lỗi khi xác nhận phiên giao dịch.");
          }
        } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          setMessage("Có lỗi xảy ra trong quá trình xác nhận.");
        }
      } else {
        setMessage("Không tìm thấy mã đơn hàng.");
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xác nhận thành công</h1>
      <div className="bg-white p-4 shadow-md rounded-md">
        <p className="text-green-500">{message}</p>

        {orderCode && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold">Mã đơn hàng:</h2>
            <p className="text-sm text-gray-700">{orderCode}</p>
          </div>
        )}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => router.push("/")}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
