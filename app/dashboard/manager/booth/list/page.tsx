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
import { Booth } from "@/types/type"
import { columns } from "./columns"

// const StatusCell = ({ value }: { value: boolean }) => (
//   <div className="capitalize">{value ? "Active" : "Inactive"}</div>
// )

// const DateCell = ({ value }: { value: string }) => {
//   const date = new Date(value)
//   return <div>{date.toLocaleDateString()}</div>
// }

// export const columns: ColumnDef<Booth>[] = [
//   {
//     accessorKey: "id",
//     header: () => <div className="text-center">ID</div>,
//     cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
//   },
//   {
//     accessorKey: "boothName",
//     header: "Booth Name",
//     cell: ({ row }) => <div>{row.getValue("boothName")}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => <StatusCell value={row.getValue("status")} />,
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created At",
//     cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
//   },
//   {
//     accessorKey: "location.locationName",
//     header: "Location Name",
//     cell: ({ row }) => <div>{row.original.location.locationName}</div>,
//   },
//   {
//     accessorKey: "location.address",
//     header: "Address",
//     cell: ({ row }) => <div>{row.original.location.address}</div>,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const booth = row.original
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
//             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booth.id.toString())}>
//               Copy booth ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

const useBoothData = () => {
  const [data, setData] = React.useState<Booth[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await AxiosAPI.get<Booth[]>("/api/Booth")
        setData(response.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

const ListBoothPage = () => {
  const { data, loading, error } = useBoothData()
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
          placeholder="Filter booth names..."
          value={(table.getColumn("boothName")?.getFilterValue() as string) ?? ""}
          onChange={(e: any) => table.getColumn("boothName")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <ColumnVisibilityDropdown table={table} />
      </div>

      <div className="rounded-md border">
        <TableComponent table={table} columns={columns} />
      </div>

      <PaginationControls table={table} />
    </div>
  )
}

const ColumnVisibilityDropdown = ({ table }: { table: any }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
        Columns <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {table.getAllColumns()
        .filter((column: any) => column.getCanHide())
        .map((column: any) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

const TableComponent = ({ table, columns }: { table: any, columns: ColumnDef<Booth>[] }) => (
  <Table>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup: any) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => (
            <TableHead key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell: any) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
)

const PaginationControls = ({ table }: { table: any }) => (
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
)

export default ListBoothPage