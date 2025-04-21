import AxiosAPI from "@/configs/axios";
import axios from "@/configs/axios";
import { Booth } from "@/types/booth";

export const deleteOrder = async (id: number) => {
  await axios.delete(`/api/Order/${id}`);
};
