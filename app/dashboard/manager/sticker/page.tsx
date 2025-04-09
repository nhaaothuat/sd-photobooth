"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import DeleteSticker from "@/components/component/DeleteSticker"
import AddSticker from "@/components/component/AddSticker"

import { Sticker } from "@/types/type"
import {columns} from "./columns"

// const DateCell = ({ value }: { value: string }) => {
//   const date = new Date(value)
//   return <div>{date.toLocaleDateString()}</div>
// }

// export const columns: ColumnDef<Sticker>[] = [
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
//     accessorKey: "stickerStyleName",
//     header: "Style",
//     cell: ({ row }) => <div>{row.getValue("stickerStyleName")}</div>,
//   },
//   {
//     accessorKey: "stickerUrl",
//     header: "Image",
//     cell: ({ row }) => <Image
//       src={row.getValue("stickerUrl")}
//       alt="Sticker"
//       width={50}
//       height={50}
//       className="rounded-md"
//     />,
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created At",
//     cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
//   },
//   {
//     accessorKey: "lastModified",
//     header: "Last Modified",
//     cell: ({ row }) => <DateCell value={row.getValue("lastModified")} />,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const sticker = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sticker.id.toString())}>
//               Copy Sticker ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Edit sticker</DropdownMenuItem>
//             <DropdownMenuItem><DeleteSticker /></DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

const useStickerData = () => {
  const [data, setData] = React.useState<Sticker[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<Sticker[]>("/api/Sticker/all")
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

const StickerPage = () => {
  const { data, loading, error,fetchData } = useStickerData()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter stickers..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
             <AddSticker onAddSuccess={fetchData}/>
            </Button>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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

export default StickerPage