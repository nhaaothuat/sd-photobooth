import AxiosAPI from "@/configs/axios";
import { PaginatedResponse } from "@/types/paginated-response";
import { DepositProduct } from "@/types/type";

export const getDepositProduct = async (
  page: number,
  size: number
): Promise<PaginatedResponse<DepositProduct>> => {
  const [res, countRes] = await Promise.all([
    AxiosAPI.get<DepositProduct[]>("/api/DepositProduct", {
      params: {
        PageNumber: page,
        PageSize: size,
      },
    }),
    AxiosAPI.get<number>("/api/DepositProduct/count"),
  ]);

  return {
    items: res.data ?? [],
    totalItems: countRes.data ?? 0,
  };
};
