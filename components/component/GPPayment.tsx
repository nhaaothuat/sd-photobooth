import { useEffect, useState } from "react"
import { Modal, Button, TextInput, Checkbox, Stack, Group, LoadingOverlay } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { PaymentMethod } from "@/types/type"
import AxiosAPI from "@/configs/axios"
import { useToast } from "@/hooks/use-toast";
import { BookUser } from "lucide-react"

const EditPaymentMethod = ({ id, onUpdated }: { id: number; onUpdated?: () => void }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [loading, setLoading] = useState(false)
const {toast} = useToast();
  const [form, setForm] = useState({
    methodName: "",
    description: "",
    isActive: false,
    isOnline: false,
    forMobile: false,
  })

  useEffect(() => {
    if (!opened) return

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
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          variant: "destructive",
          title: "Error", // Thay thế t("errorTitle")
          description: "An error occurred", // Thay thế t("errorDesc")
        })
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [opened, id])

  const handleUpdate = async () => {
    try {
      await AxiosAPI.put(`/api/PaymentMethod/${id}`, form)
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
        title: "Success", // Thay thế t("successTitle")
        description: "Operation completed successfully", // Thay thế t("successDesc")
      })
      close()
      onUpdated?.()
    } catch (error) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
      console.error(error)
    }
  }

  return (
    <>
      <Button variant="outline"  onClick={open}>
        <BookUser  />
      </Button>

      <Modal opened={opened} onClose={close} title="Edit Payment Method" centered>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        {!loading && (
          <Stack gap="sm">
            <TextInput
              label="Method Name"
              placeholder="Enter method name"
              value={form.methodName}
              onChange={(e) => setForm({ ...form, methodName: e.currentTarget.value })}
            />
            <TextInput
              label="Description"
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.currentTarget.value })}
            />
            <Checkbox
              label="Active"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.currentTarget.checked })}
            />
            <Checkbox
              label="Online"
              checked={form.isOnline}
              onChange={(e) => setForm({ ...form, isOnline: e.currentTarget.checked })}
            />
            <Checkbox
              label="For Mobile"
              checked={form.forMobile}
              onChange={(e) => setForm({ ...form, forMobile: e.currentTarget.checked })}
            />
            <Group mt="md">
              <Button onClick={handleUpdate}>Update</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}

export default EditPaymentMethod
