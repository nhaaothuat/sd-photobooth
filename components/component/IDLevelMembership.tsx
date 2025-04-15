import { useEffect, useState } from "react"
import { LevelMembership } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"


const ViewDetailLevelMembership = ({ id }: { id: number }) => {
  const [level, setLevel] = useState<LevelMembership | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<LevelMembership>(`/api/LevelMembership/${id}`)
      setLevel(response.data)
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chi tiết", error)
      setLevel(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchDetail()
  }, [open])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Xem</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết phương thức thanh toán</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="animate-spin h-4 w-4" /> <span>Đang tải...</span>
          </div>
        ) : level ? (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {level.id}</p>
            <p><strong>Method Name:</strong> {level.name}</p>
          
            {/* <p><strong>URL:</strong> {frame.frameUrl}</p> */}
            <p><strong>Style Name:</strong> {level.description}</p>
            <p><strong>Slot Count:</strong> {level.point}</p>
            <p><strong>Slot Count:</strong> {level.maxDiscount}</p>
            <p><strong>Slot Count:</strong> {level.minOrder}</p>
            <p><strong>Slot Count:</strong> {level.discountPercent}</p>
            <p><strong>For Mobile:</strong> {level.isActive ? "Yes" : "No"}</p>
            {/* <p><strong>Created At:</strong> {new Date(level.).toLocaleString()}</p> */}
          </div>
        ) : (
          <div className="text-sm text-red-500">Không thể tải dữ liệu chi tiết</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailLevelMembership
