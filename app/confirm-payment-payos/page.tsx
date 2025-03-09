"use client"
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const ConfimPayOS = () => {
     const searchParams = useSearchParams();

     const code = searchParams.get("code");
     const id = searchParams.get("id");
     const cancel = searchParams.get("cancel");
     const status = searchParams.get("status");
     const orderCode = searchParams.get("orderCode");

     useEffect(() => {
          console.log("PayOS Response Data:", {
               code,
               id,
               cancel,
               status,
               orderCode
          });
     }, [code, id, cancel, status, orderCode]);

     return (
          <div className="p-6 max-w-2xl mx-auto">
               <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
               <div className="bg-white p-4 shadow-md rounded-md">
                    <p><strong>Code:</strong> {code}</p>
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Cancelled:</strong> {cancel}</p>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Order Code:</strong> {orderCode}</p>
               </div>
          </div>
     );
};

export default ConfimPayOS;
