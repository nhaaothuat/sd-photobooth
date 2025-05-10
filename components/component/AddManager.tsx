"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import AxiosAPI from "@/configs/axios"
import { useToast } from "@/hooks/use-toast"
import { IoIosAddCircleOutline } from "react-icons/io"

const AddManager = ({ onSuccess }: { onSuccess: () => void }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    role: 1,
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    fullName: "",
    gender: 2,
    birthDate: "",
  })

  const resetForm = () => {
    setFormData({
      role: 1,
      userName: "",
      email: "",
      phoneNumber: "",
      password: "",
      fullName: "",
      gender: 2,
      birthDate: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, gender: parseInt(value) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await AxiosAPI.post("/api/User/create", formData)
      if (response.status === 200 || response.status === 201) {
        toast({
          className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-600 text-white",
          title: "Success", // Thay thế t("successTitle")
          description: "Operation completed successfully", // Thay thế t("successDesc")
        })
        onSuccess()
        setOpen(false)
        resetForm()
      } else {
        throw new Error("Failed to create user")
      }
    } catch (err) {
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} ><IoIosAddCircleOutline /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm Quản Lý</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="userName">Username</Label>
            <Input id="userName" name="userName" value={formData.userName} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label>Gender</Label>
            <Select onValueChange={handleSelectChange} defaultValue={formData.gender.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Male</SelectItem>
                <SelectItem value="1">Female</SelectItem>
                <SelectItem value="2">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddManager
