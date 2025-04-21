"use client";

import { LoadingSkeleton } from "@/components/layouts/LoadingSkeleton";
import { columns } from "./columns";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Session } from "@/types/type";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import AxiosAPI from "@/configs/axios";
import { useDebounce } from "@/hooks/useDebounce";

const CrudPageWrapper = dynamic(
  () =>
    import("@/components/layouts/SharedPage").then(
      (mod) => mod.MemoizedCrudPage
    ),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false,
  }
);

const SessionPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, totalItems, isLoading, refetch } = usePaginatedQuery<Session>({
    queryKey: "sessions",
    pageIndex,
    pageSize,
    search: debouncedSearch,
    queryFn: async ({ page, size, search }) => {
      const url = search?.trim()
        ? `/api/Session/by-code/${search}`
        : `/api/Session`;
      const res = await AxiosAPI.get<Session[]>(url, {
        params: { PageNumber: page, PageSize: size },
      });

      const countRes = await AxiosAPI.get<number>("/api/Session/count");
      return {
        items: res.data ?? [],
        totalItems: countRes.data ?? 0,
      };
    },
  });

  const memoizedColumns = useMemo(() => columns(), []);

  return (
    <CrudPageWrapper
      title="Session Management"
      isSearchable
      search={search}
      onSearchChange={setSearch}
      data={data}
      columns={memoizedColumns}
      isLoading={isLoading}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPageChange={setPageIndex}
      onPageSizeChange={setPageSize}
    />
  );
};

export default SessionPage;
