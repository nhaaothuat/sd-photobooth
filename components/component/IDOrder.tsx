import { useEffect, useState } from "react"
import { Order } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"

import { FaEye } from "react-icons/fa"
import { Container, Skeleton, Stack, Text } from "@mantine/core"


const ViewDetailOrder = ({ id }: { id: number }) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<Order>(`/api/Order/${id}`)
      setOrder(response.data)
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu chi tiết", error)
      setOrder(null)
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
        <Button variant="outline"><FaEye /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết </DialogTitle>
        </DialogHeader>

        {loading ? (
           <Skeleton height={8} mt={6} width="70%" radius="xl" />
        ) : order ? (
          <Container size="xs" mt={20}>
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              <strong>ID:</strong> {order.id}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Code:</strong> {order.code}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Coupon Code:</strong> {order.couponCode}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Booth Name:</strong> {order.boothName}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Phone:</strong> {order.phone}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Session Code:</strong> {order.sessionCode}
            </Text>
            <Text size="sm" fw={500}>
              <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
            </Text>
          </Stack>
        </Container>
        ) : (
          <div className="text-sm text-red-500">Không thể tải dữ liệu chi tiết</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailOrder
