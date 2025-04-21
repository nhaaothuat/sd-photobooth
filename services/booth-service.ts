import AxiosAPI from "@/configs/axios";
import axios from "@/configs/axios";
import { Booth } from "@/types/booth";

export const getBoothList = async (params: {
  page: number;
  size: number;
  search?: string;
}): Promise<Booth[] | null> => {
  const response = await AxiosAPI.get<Booth[]>(
    `/api/Booth/by-name/${params.search}`,
    {
      params: { PageNumber: params.page, PageSize: params.size },
    }
  );
  return response.data;
};

export const deleteBooth = async (id: number) => {
  await axios.delete(`/booth/${id}`);
};
