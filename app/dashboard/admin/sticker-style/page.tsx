"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import { Sticker, StickerStyle } from "@/types/type";
import AxiosAPI from "@/configs/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import AddSticker from "@/components/component/AddSticker";
import { Skeleton } from "@mantine/core";

const useStickerData = () => {
  const [data, setData] = useState<StickerStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const response = await AxiosAPI.get<number>("/api/StickerStyle/count");
      setTotalItems(response.data || 0);
    } catch (err) {
      console.error("Failed to fetch total count", err);
    }
  }, []);

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await AxiosAPI.get<StickerStyle[]>("/api/StickerStyle/all", {
        params: { PageNumber: page, PageSize: pageSize },
      });
      setData(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    totalItems,
    fetchCount,
    fetchData,
  };
};

const StickerPage = () => {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const {toast} = useToast();
  const { data, loading, error, totalItems, fetchCount, fetchData } =
    useStickerData();

  const deleteFrame = useCallback(
    async (id: number) => {
      try {
        const res = await AxiosAPI.delete(`/api/StickerStyle/${id}`);

        if (res.status !== 200) throw new Error("Xóa thất bại");

        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
          title: "Success", // Thay thế t("successTitle")
          description: "Operation completed successfully", // Thay thế t("successDesc")
        })
        fetchCount();
        if (data.length <= 1 && pageIndex > 0) {
          setPageIndex((prev) => prev - 1);
        } else {
          fetchData(pageIndex + 1, pageSize);
        }
      } catch (error) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          variant: "destructive",
          title: "Error", // Thay thế t("errorTitle")
          description: "An error occurred", // Thay thế t("errorDesc")
        })
        console.error(error);
      }
    },
    [data.length, fetchCount, fetchData, pageIndex, pageSize]
  );

  const memoizedColumns = useMemo(
    () => columns(deleteFrame, () => fetchData(pageIndex + 1, pageSize)),
    [deleteFrame, fetchData, pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    pageCount: Math.ceil(totalItems / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
  });

  useEffect(() => {
    fetchData(pageIndex + 1, pageSize);
    fetchCount();
  }, [fetchData, fetchCount, pageIndex, pageSize]);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value));
      setPageIndex(0);
    },
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <AddSticker
            onAddSuccess={() => {
              fetchCount();

              setPageIndex(0);
            }}
          />
          <Label htmlFor="pageSize" className="text-sm">
          Number of rows/page:
          </Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                      colSpan={memoizedColumns.length}
                      className="text-center"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => prev - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => prev + 1)}
              disabled={pageIndex + 1 >= table.getPageCount()}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StickerPage;
