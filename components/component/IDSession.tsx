import { useEffect, useState } from "react"
import { Session } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"
import { FaEye } from "react-icons/fa"
import { Skeleton } from "@mantine/core"
import { Card } from "../ui/card"
import { useTranslations } from "next-intl"



const ViewDetailSession = ({ id }: { id: number }) => {

     const [session, setSession] = useState<Session | null>(null)
     const [open, setOpen] = useState(false)
     const [loading, setLoading] = useState(false)
     const t = useTranslations("staff");
     const fetchDetail = async () => {
          try {
               setLoading(true)
               const response = await AxiosAPI.get<Session>(`/api/Session/${id}`)
               setSession(response.data)
          } catch (error) {
               console.error("Lỗi khi lấy dữ liệu chi tiết", error)
               setSession(null)
          } finally {
               setLoading(false)
          }
     }
     const formatDate = (date: any) => {
          return date ? new Date(date).toLocaleString() : "Chưa xác định";
     };

     useEffect(() => {
          if (open) fetchDetail()
     }, [open])

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger className="border-green-500" asChild>
                    <Button variant="outline"><FaEye /></Button>
               </DialogTrigger>

               <DialogContent className="rounded-2xl p-6 sm:max-w-md bg-white shadow-xl">
                    <DialogHeader>
                         <DialogTitle className="text-lg font-semibold text-gray-900">
                         {t("detailTitle")}
                         </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                         <Skeleton height={8} mt={6} width="70%" radius="xl" />
                    ) : session ? (
                         <div className="space-y-3 text-sm text-gray-800">
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("id")}:</span>
                                   <span>{session.id}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("code")}:</span>
                                   <span>{session.code}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("expired")}:</span>
                                   <span>{formatDate(session.expired)}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("orderId")}:</span>
                                   <span>{session.orderId}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("status")}:</span>
                                   <span>{session.isActive ? t("active") : t("inactive")}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="font-medium text-gray-600">{t("createdAt")}:</span>
                                   <span>{new Date(session.createdAt).toLocaleString()}</span>
                              </div>
                         </div>
                    ) : (
                         <div className="text-sm text-red-500">{t("loadError")}</div>
                    )}
               </DialogContent>
          </Dialog>

     )
}

export default ViewDetailSession
