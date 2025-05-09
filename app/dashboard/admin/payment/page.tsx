"use client"
import { useCallback, useEffect, useState } from 'react'
import { columns } from "./columns"
import { PaymentMethod } from "@/types/type"
import AxiosAPI from "@/configs/axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'

import { Label } from '@/components/ui/label'
import AddPayment from '@/components/component/AddPayment'
import { Skeleton } from '@mantine/core'

const usePaymentMethodData = () => {
  const [data, setData] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  const fetchCount = useCallback(async () => {
    try {
      const response = await AxiosAPI.get<number>("/api/PaymentMethod/count")
      setTotalItems(response.data || 0)
    } catch (err) {
      console.error("Failed to fetch total count", err)
    }
  }, [])

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<PaymentMethod[]>("/api/PaymentMethod", {
        params: { PageNumber: page, PageSize: pageSize }
      })
      setData(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchByName = useCallback(async (name: string, page: number, pageSize: number) => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<PaymentMethod[]>(`/api/PaymentMethod/by-name/${name}`, {
        params: { PageNumber: page, PageSize: pageSize }
      })
      setData(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch by name")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    debounce((term: string, page: number, size: number) => {
      if (term.trim() === "") {
        fetchData(page, size)
      } else {
        fetchByName(term, page, size)
      }
    }, 500),
    [fetchData, fetchByName]
  )

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  return {
    data,
    loading,
    error,
    totalItems,
    fetchCount,
    fetchData,
    handleSearch
  }
}

const PaymentMethodPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [pageSize, setPageSize] = useState(5)
  const [pageIndex, setPageIndex] = useState(0)

  const {
    data,
    loading,
    error,
    totalItems,
    fetchCount,
    handleSearch
  } = usePaymentMethodData()

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  useEffect(() => {
    handleSearch(searchTerm, pageIndex + 1, pageSize)
  }, [searchTerm, pageIndex, pageSize, handleSearch])

  const deletePayment = async (id: number) => {
    try {
      const res = await AxiosAPI.delete(`/api/PaymentMethod/${id}`)


      if (res.status !== 200) throw new Error("Xóa thất bại")

      toast.success("Đã xóa phương thức thanh toán thành công")
      fetchCount()
      if (data.length <= 1 && pageIndex > 0) {
        setPageIndex(pageIndex - 1)
      } else {
        handleSearch(searchTerm, pageIndex + 1, pageSize)
      }
    } catch (error) {
      toast.error("Xóa thất bại")
      console.error(error)
    }
  }

  const table = useReactTable({
    data,
    columns: columns(deletePayment,() => handleSearch(searchTerm, pageIndex + 1, pageSize)),
    pageCount: Math.ceil(totalItems / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(newPagination.pageIndex)
      setPageSize(newPagination.pageSize)
    }
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Tìm kiếm TypeSession (full-text)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPageIndex(0)
          }}
          className="max-w-sm"
        />
       
        <div className="flex items-center space-x-2">
          <Label htmlFor="pageSize" className="text-sm">Số hàng/trang:</Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPageIndex(0)
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[5, 10, 15, 20].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
         <Skeleton height={8} mt={6} width="70%" radius="xl" />
      ) : error ? (
        <div className="text-red-500 p-4">Error: {error}</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">No results</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentMethodPage
