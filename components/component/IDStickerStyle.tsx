import { useEffect, useState } from "react"
import { StickerStyle } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Skeleton, Paper, Text, Title, Stack } from "@mantine/core"
import { FaEye } from "react-icons/fa"

const ViewDetailStickerStyle = ({ id }: { id: number }) => {
  const [stickerStyle, setStickerStyle] = useState<StickerStyle | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<StickerStyle>(`/api/StickerStyle/${id}`)
      setStickerStyle(response.data)
    } catch (error) {
      console.error("Error fetching details", error)
      setStickerStyle(null)
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
        <Button variant="outline" className="border-green-500"><FaEye /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sticker Style Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <Skeleton height={100} radius="md" />
        ) : stickerStyle ? (
          <Paper withBorder shadow="sm" p="md" radius="md">
            <Stack gap="xs">
              <Text size="sm"><strong>ID:</strong> {stickerStyle.id}</Text>
              <Text size="sm"><strong>Style Name:</strong> {stickerStyle.stickerStyleName}</Text>
              <Text size="sm"><strong>Description:</strong> {stickerStyle.description}</Text>
              <Text size="sm"><strong>Created At:</strong> {new Date(stickerStyle.createdAt).toLocaleString()}</Text>
            </Stack>
          </Paper>
        ) : (
          <Text color="red" size="sm">Failed to load sticker style details.</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailStickerStyle
