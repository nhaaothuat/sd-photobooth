import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentMethod } from "@/types/type"
import AxiosAPI from "@/configs/axios"
import { toast } from "react-toastify"
import { BookUser } from 'lucide-react';
const EditPaymentMethod = ({ id, onUpdated }: { id: number; onUpdated?: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    methodName: "",
    description: "",
    isActive: false,
    isOnline: false,
    forMobile: false,
  })


  useEffect(() => {
    if (!open) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await AxiosAPI.get<PaymentMethod>(`/api/PaymentMethod/${id}`)
        const data = res.data
        setForm({
          methodName: data?.methodName || "",
          description: data?.description || "",
          isActive: data?.isActive ?? false,
          isOnline: data?.isOnline ?? false,
          forMobile: data?.forMobile ?? false,
        })
      } catch (err) {
        toast.error("Lỗi khi lấy thông tin phương thức")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open, id])

  // Handle update
  const handleUpdate = async () => {
    try {
      await AxiosAPI.put(`/api/PaymentMethod/${id}`, form)
      toast.success("Cập nhật thành công!")

      setOpen(false)
      onUpdated?.()
    } catch (error) {
      toast.error("Cập nhật thất bại")
      console.error(error)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"> <BookUser /></Button>
      </DialogTrigger>
      <DialogContent role="dialog" aria-modal="false">
        <DialogHeader>
          <DialogTitle>Sửa phương thức thanh toán</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Tên phương thức"

              value={form.methodName}
              onChange={(e) => setForm({ ...form, methodName: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(val) => setForm({ ...form, isActive: Boolean(val) })}
              />
              <span>Kích hoạt</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isOnline}
                onCheckedChange={(val) => setForm({ ...form, isOnline: Boolean(val) })}
              />
              <span>Trực tuyến</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.forMobile}
                onCheckedChange={(val) => setForm({ ...form, forMobile: Boolean(val) })}
              />
              <span>Dành cho di động</span>
            </div>

            <Button onClick={handleUpdate} className="w-full mt-2">
              Cập nhật
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditPaymentMethod