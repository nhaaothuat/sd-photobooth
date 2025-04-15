import { useEffect, useState } from "react"
import { Booth } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"
const ViewDetailBooth = ({ id }: { id: number }) => {
   const [booth, setBooth] = useState<Booth | null>(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
  
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const response = await AxiosAPI.get<Booth>(`/api/Booth/${id}`)
        setBooth(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chi tiết", error)
        setBooth(null)
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
          ) : booth ? (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {booth.id}</p>
              <p><strong>Method Name:</strong> {booth.boothName}</p>
            
              
              <p><strong>Style Name:</strong> {booth.location.locationName}</p>
              
              <p><strong>For Mobile:</strong> {booth.status ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {new Date(booth.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <div className="text-sm text-red-500">Không thể tải dữ liệu chi tiết</div>
          )}
        </DialogContent>
      </Dialog>
    )
}

export default ViewDetailBooth
