"use client"
import AxiosAPI from '@/configs/axios'
import React, { useState } from 'react'
import {PaymentMethod} from  "@/types/type"


const usePaymentMethodData = () => {
  const [data, setData] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<PaymentMethod[]>("/api/PaymentMethod")
      setData(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error,fetchData }
}

const PaymentMethodPage = () => {
  const { data, loading, error,fetchData } = usePaymentMethodData()


  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  return (
    <div>
      
    </div>
  )
}

export default PaymentMethodPage
