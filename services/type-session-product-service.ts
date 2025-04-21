import AxiosAPI from "@/configs/axios";
import axios from "@/configs/axios";
import { PaginatedResponse } from "@/types/paginated-response";
import { TypeSessionProduct } from "@/types/type";

export const getTypeSessionProductList = async (
  page: number,
  size: number
): Promise<PaginatedResponse<TypeSessionProduct>> => {
  const res = await AxiosAPI.get<TypeSessionProduct[]>(
    "/api/TypeSessionProduct",
    {
      params: { PageNumber: page, PageSize: size },
    }
  );

  const countRes = await AxiosAPI.get<number>("/api/TypeSessionProduct/count");
  return {
    items: res.data ?? [],
    totalItems: countRes.data ?? 0,
  };
};

export const deleteTypeSessionProduct = async (id: number) => {
  await axios.delete(`/TypeSessionProduct/${id}`);
};
