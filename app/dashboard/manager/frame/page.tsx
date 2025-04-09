"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AxiosAPI from "@/configs/axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Frame } from "@/types/type"
import  {columns} from "./columns"

// const DateCell = ({ value }: { value: string }) => {
//   const date = new Date(value)
//   return <div>{date.toLocaleDateString()}</div>
// }

// export const columns: ColumnDef<Frame>[] = [
//   {
//     accessorKey: "id",
//     header: () => <div className="text-center">ID</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => <div>{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "frameStyleName",
//     header: "Style",
//     cell: ({ row }) => <div>{row.getValue("frameStyleName")}</div>,
//   },
//   {
//     accessorKey: "slotCount",
//     header: "Slots",
//     cell: ({ row }) => <div>{row.getValue("slotCount")}</div>,
//   },
//   {
//     accessorKey: "frameUrl",
//     header: "Preview",
//     cell: ({ row }) => (
//       <Image
//         src={row.getValue("frameUrl")}
//         alt="Frame"
//         width={80}
//         height={80}
//         className="rounded-md"
//       />
//     ),
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created At",
//     cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
//   },
// ]

const useFrameData = () => {
  const [data, setData] = React.useState<Frame[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<Frame[]>("/api/Frame")
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

  return { data, loading, error, fetchData }
}

const FramePage = () => {
  const { data, loading, error } = useFrameData()
  const [filter, setFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
  })

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter frames..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-end space-x-2 py-4">
             
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
    </div>
  )
}

export default FramePage
