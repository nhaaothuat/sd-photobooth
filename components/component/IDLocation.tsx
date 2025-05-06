import { useEffect, useState } from "react"
import { Location } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"


const ViewDetailLocation = ({ id }: { id: number }) => {
  const [location, setLocation] = useState<Location | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<Location>(`/api/Location/${id}`)
      setLocation(response.data)
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chi tiết", error)
      setLocation(null)
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
          <DialogTitle>Chi tiết </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="animate-spin h-4 w-4" /> <span>Đang tải...</span>
          </div>
        ) : location ? (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {location.id}</p>
            <p><strong>Location Name:</strong> {location.locationName}</p>
            <p><strong>Address:</strong> {location.address}</p>
            <p><strong>Created At:</strong> {new Date(location.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <div className="text-sm text-red-500">Không thể tải dữ liệu chi tiết</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailLocation
