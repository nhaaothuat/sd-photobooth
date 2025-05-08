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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AxiosAPI from "@/configs/axios"
import { useToast } from "@/hooks/use-toast"
import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"


const GPProfile: React.FC<{ onUpdateSuccess: () => void }> = ({ onUpdateSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",

    phoneNumber: "",
    gender: 0,
    birthDate: new Date().toISOString().slice(0, 10),
  })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const t = useTranslations("staff");
  const { toast } = useToast();
  const a = useTranslations("toast");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGenderChange = (value: string) => {
    setForm({ ...form, gender: Number(value) })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await AxiosAPI.patch("/api/Identity/update-profile", form)
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
        <Button variant="outline" size="icon" className="rounded-full p-2 shadow-md hover:bg-muted ">
          <Pencil className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('updateProfile')}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('updateProfileDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="font-semibold">{t('fullName')}</Label>
            <Input
              name="fullName"
              placeholder={t('fullName')}
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber" className="font-semibold">{t('phoneNumber')}</Label>
            <Input
              name="phoneNumber"
              placeholder={t('phoneNumber')}
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender" className="font-semibold">{t('gender')}</Label>
            <Select value={form.gender.toString()} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('male')}</SelectItem>
                <SelectItem value="1">{t('female')}</SelectItem>
                <SelectItem value="2">{t('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate" className="font-semibold">{t('birthDate')}</Label>
            <Input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90 transition"
          >
            {loading ? t('saving') : t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default GPProfile
