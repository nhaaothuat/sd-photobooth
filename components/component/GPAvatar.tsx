"use client"

import { Button } from "@/components/ui/button"

import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AxiosAPI from "@/configs/axios"
import { useToast } from "@/hooks/use-toast"
import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "react-toastify"

interface GPAvatarProps {
     onUpdateSuccess: () => void
}

const GPAvatar:React.FC<GPAvatarProps> = ({onUpdateSuccess}) => {
     const [file, setFile] = useState<File | null>(null)
     const [loading, setLoading] = useState(false)
     const [open, setOpen] = useState(false)
     const { toast } = useToast();
     const a = useTranslations("toast")
     const t = useTranslations("staff")
     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selected = e.target.files?.[0] || null
          setFile(selected)
     }

     const handleSubmit = async () => {
          if (!file) return alert("Please select a file")
      
          const formData = new FormData()
          formData.append("avatar", file)
      
          try {
            setLoading(true)
      
            const response = await AxiosAPI.put("/api/Identity/update-avatar", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
      
            
            toast({
               className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
               title: a("successTitle"),
               description: a("successDesc"),
             })
            onUpdateSuccess()
            setOpen(false)
          } catch (err) {
          
            toast({
               className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ",
               variant: "destructive",
               title: a("errorTitle"),
               description: a("errorDesc"),
       
             })
          } finally {
            setLoading(false)
          }
        }
     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline" size={"lg"} className="flex items-center  ">
                         <Pencil className="w-10 h-10" />

                    </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>{t('editProfile')}</DialogTitle>
                         <DialogDescription>
                         {t('editProfileDescription')}
                         </DialogDescription>
                    </DialogHeader>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                         <Label htmlFor="picture">{t('picture')}</Label>
                         <Input id="picture" type="file" onChange={handleFileChange} />
                    </div>

                    <DialogFooter>
                         <Button onClick={handleSubmit} disabled={loading}>
                              {loading ? t('saving') : t('saveChanges')}
                         </Button>

                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}

export default GPAvatar
