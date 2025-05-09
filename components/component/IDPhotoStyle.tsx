import { useEffect, useState } from "react"
import { PhotoStyle } from "@/types/type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AxiosAPI from "@/configs/axios"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { FaEye } from "react-icons/fa"
import { Paper, Text, Group, Stack, Divider, Skeleton } from "@mantine/core"

const ViewDetailPhotoStyle = ({ id }: { id: number }) => {
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      const response = await AxiosAPI.get<PhotoStyle>(`/api/PhotoStyle/${id}`)
      setPhotoStyle(response.data)
    } catch (error) {
      console.error("Error fetching photo style detail", error)
      setPhotoStyle(null)
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
        <Button variant="outline" className="border-green-500">
          <FaEye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Photo Style Detail</DialogTitle>
        </DialogHeader>

        {loading ? (
          <Group gap="sm">
            <Loader2 className="animate-spin h-4 w-4" />
            <Text size="sm" color="dimmed">Loading...</Text>
          </Group>
        ) : photoStyle ? (
          <Paper p="md" radius="md" shadow="xs" withBorder>
            <Stack gap="xs">
              <Text size="sm"><strong>ID:</strong> {photoStyle.id}</Text>
              <Text size="sm"><strong>Name:</strong> {photoStyle.name}</Text>

              <Image
                src={photoStyle.imageUrl}
                alt={photoStyle.name}
                width={200}
                height={200}
              />

              <Divider my="sm" />
              <Text size="sm"><strong>Description:</strong> {photoStyle.description}</Text>
              <Text size="sm"><strong>Prompt:</strong> {photoStyle.prompt}</Text>
              <Text size="sm"><strong>Negative Prompt:</strong> {photoStyle.negativePrompt}</Text>
              <Text size="sm"><strong>Images per Generation:</strong> {photoStyle.numImagesPerGen}</Text>
              <Text size="sm"><strong>Width:</strong> {photoStyle.width}px</Text>
              <Text size="sm"><strong>Height:</strong> {photoStyle.height}px</Text>
              <Text size="sm"><strong>Controlnets:</strong> {photoStyle.controlnets}</Text>
              <Text size="sm"><strong>IP Adapter Scale:</strong> {photoStyle.ipAdapterScale}</Text>
              <Text size="sm"><strong>Background Remover:</strong> {photoStyle.backgroundRemover ? "Yes" : "No"}</Text>
              <Text size="sm"><strong>Created At:</strong> {new Date(photoStyle.createdAt).toLocaleString()}</Text>
            </Stack>
          </Paper>
        ) : (
          <Text size="sm" color="red">Failed to load photo style details.</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailPhotoStyle
