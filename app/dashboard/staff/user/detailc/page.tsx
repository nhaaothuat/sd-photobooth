"use client";
import React, { useState } from "react";

import AxiosAPI from "@/configs/axios";
import { User } from "@/types/type";
import { useTranslations } from "next-intl";

const ViewDetailCustomer = () => {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const  t  = useTranslations("staff");
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
        setError("Không tìm thấy thông tin khách hàng.");
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền truy cập thông tin này.");
      } else if (err.response?.status === 400) {
        setError("Email không hợp lệ.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 tracking-tight">
      {t('customerInfo')}
      </h2>

      <div className="flex gap-3 mb-6">
        <input
          type="email"
          className="flex-1 border border-gray-300 bg-white text-gray-900 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder={t('inputEmailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleFetchCustomer}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:bg-gray-300 transition"
          disabled={loading || !email}
        >
          {loading ? t('loading') : t('search')}
        </button>
      </div>

      {error && (
        <div className="p-4 border border-red-300 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {!error && customer && (
        <div className="border-t pt-6 mt-4 space-y-3 text-gray-800">
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('id')}:</span>
            <span>{customer.id}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('fullName')}:</span>
            <span>{customer.fullName || "Chưa có"}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('username')}:</span>
            <span>{customer.userName}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('email')}:</span>
            <span>{customer.email}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('phone')}:</span>
            <span>{customer.phoneNumber || "Chưa có"}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('gender')}:</span>
            <span>
              {customer.gender === 0
                ? t('male')
                : customer.gender === 1
                  ? t('female')
                  : t('other')}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('birthDate')}:</span>
            <span>{customer.birthDate || t('notAvailable')}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('role')}:</span>
            <span>{customer.role}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-medium text-gray-600">{t('isBanned')}:</span>
            <span>{customer.isBanned ? t('yes') : t('no')}</span>
          </p>
        </div>
      )}
    </div>



  );
};

export default ViewDetailCustomer;
