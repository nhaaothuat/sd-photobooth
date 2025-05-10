import { useEffect, useState } from "react"
import { PaymentMethod } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Skeleton, Paper, Stack, Text } from "@mantine/core"
import { Loader2 } from "lucide-react"
import { FaEye } from "react-icons/fa"

const ViewDetail = ({ id }: { id: number }) => {
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<PaymentMethod>(`/api/PaymentMethod/${id}`)
      setPayment(response.data)
    } catch (error) {
      console.error("Error fetching payment method detail", error)
      setPayment(null)
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
        <Button variant="outline" className="border-green-500"><FaEye/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Method Detail</DialogTitle>
        </DialogHeader>

        {loading ? (
          <Stack gap="xs">
            <Skeleton height={12} width="80%" radius="xl" />
            <Skeleton height={12} width="60%" radius="xl" />
            <Skeleton height={12} width="70%" radius="xl" />
          </Stack>
        ) : payment ? (
          <Paper p="md" radius="md" shadow="xs" withBorder>
            <Stack gap="xs">
              <Text size="sm"><strong>ID:</strong> {payment.id}</Text>
              <Text size="sm"><strong>Method Name:</strong> {payment.methodName}</Text>
              <Text size="sm"><strong>Description:</strong> {payment.description}</Text>
              <Text size="sm"><strong>Is Active:</strong> {payment.isActive ? "Yes" : "No"}</Text>
              <Text size="sm"><strong>Is Online:</strong> {payment.isOnline ? "Yes" : "No"}</Text>
              <Text size="sm"><strong>For Mobile:</strong> {payment.forMobile ? "Yes" : "No"}</Text>
              <Text size="sm"><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</Text>
            </Stack>
          </Paper>
        ) : (
          <Text size="sm" color="red">Failed to load payment method details.</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetail
