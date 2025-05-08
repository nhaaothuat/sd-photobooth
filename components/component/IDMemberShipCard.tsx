import { useEffect, useState } from "react"
import { MembershipCard } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"
import { FaEye } from "react-icons/fa"
import { useTranslations } from "next-intl"
import { Skeleton } from "@mantine/core"


const ViewDetailMembershipCard = ({ id }: { id: number }) => {
  const [member, setMember] = useState<MembershipCard | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
const t = useTranslations("staff")
  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<MembershipCard>(`/api/MembershipCard/${id}`)
      setMember(response.data)
    } catch (error) {
     
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchDetail()
  }, [open])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border-green-500" asChild>
        <Button variant="outline">
          <FaEye />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
          {t("memberDetail")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        ) : member ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-4 text-sm text-gray-800">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("id")}</span>
              <span className="font-medium">{member.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("currentPoint")}</span>
              <span className="font-medium">{member.points}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("description")}</span>
              <span className="font-medium">{member.description}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("name")}</span>
              <span className="font-medium">{member.customer.fullName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("email")}</span>
              <span className="font-medium">{member.customer.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("targetLevel")}</span>
              <span className="font-medium">{member.levelMemberShip.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("levelPoints")}</span>
              <span className="font-medium">{member.levelMemberShip.point}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("active")}</span>
              <span className="font-medium">{member.isActive ? t("yes") : t("no")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{t("createdAt")}</span>
              <span className="font-medium">
                {new Date(member.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-500 mt-4">{t("failedToLoad")}</div>
        )}
      </DialogContent>
    </Dialog>

  )
}

export default ViewDetailMembershipCard
