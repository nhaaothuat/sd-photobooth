
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
import Image from "next/image"
import { Frame } from "@/types/type"

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value)
  return <div>{date.toLocaleDateString()}</div>
}

export const columns: ColumnDef<Frame>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "frameStyleName",
    header: "Style",
    cell: ({ row }) => <div>{row.getValue("frameStyleName")}</div>,
  },
  {
    accessorKey: "slotCount",
    header: "Slots",
    cell: ({ row }) => <div>{row.getValue("slotCount")}</div>,
  },
  {
    accessorKey: "frameUrl",
    header: "Preview",
    cell: ({ row }) => (
      <Image
        src={row.getValue("frameUrl")}
        alt="Frame"
        width={80}
        height={80}
        className="rounded-md"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
]
