import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import AxiosAPI from "@/configs/axios";

interface User {
  id: string;
  fullName: string | null;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isBanned: boolean;
  location?: {
    locationName: string;
  } | null;
}

interface FilterUserRequest {
  roles: number[];
  email: string;
  locationName: string;
}

const roleOptions = [
     { label: "None", value: -1 }, // Giá trị mặc định khi không chọn vai trò
     { label: "Admin", value: 0 },
     { label: "Manager", value: 1 },
     { label: "Staff", value: 2 },
     { label: "Customer", value: 3 },
   ];

   const GpFilter: React.FC = () => {
     const [selectedRole, setSelectedRole] = useState<number>(-1);
     const [email, setEmail] = useState<string>("");
     const [locationName, setLocationName] = useState<string>("");
     const [loading, setLoading] = useState<boolean>(false);
     const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
   
     const handleFilter = async () => {
       setLoading(true);
       try {
         let requestBody: Partial<FilterUserRequest> = {};
   
         if (selectedRole !== -1) requestBody.roles = [selectedRole]; // Chỉ gửi nếu khác None
         if (email.trim() !== "") requestBody.email = email;
         if (locationName.trim() !== "") requestBody.locationName = locationName;
   
         console.log("Request Body:", requestBody);
   
         const response = await AxiosAPI.post<User[]>("api/User/filter", requestBody as any);
   
         console.log("Response Data:", response.data);
   
         setFilteredUsers(response.data as User[]);
         toast.success("Lọc thành công!");
       } catch (error) {
         console.error("API Error:", error);
         toast.error("Lỗi khi lọc dữ liệu. Vui lòng thử lại.");
       } finally {
         setLoading(false);
       }
     };
   
     return (
       <Card className="max-w-md mx-auto p-4">
         <CardHeader>
           <CardTitle>Bộ lọc người dùng</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             <div className="flex flex-col space-y-1.5">
               <Label>Email</Label>
               <Input
                 type="email"
                 placeholder="Nhập email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </div>
   
             <div className="flex flex-col space-y-1.5">
               <Label>Vai trò</Label>
               <Select onValueChange={(value) => setSelectedRole(Number(value))} value={selectedRole.toString()}>
                 <SelectTrigger>
                   <SelectValue placeholder="Chọn vai trò" />
                 </SelectTrigger>
                 <SelectContent>
                   {roleOptions.map((role) => (
                     <SelectItem key={role.value} value={role.value.toString()}>
                       {role.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
   
             <div className="flex flex-col space-y-1.5">
               <Label>Địa điểm</Label>
               <Input
                 type="text"
                 placeholder="Nhập địa điểm"
                 value={locationName}
                 onChange={(e) => setLocationName(e.target.value)}
               />
             </div>
   
             <Button onClick={handleFilter} disabled={loading} className="w-full">
               {loading ? "Đang lọc..." : "Lọc"}
             </Button>
   
             {filteredUsers.length > 0 && (
               <div className="mt-4 border p-4 rounded-lg">
                 <h3 className="text-lg font-bold">Kết quả lọc</h3>
                 {filteredUsers.map((user) => (
                   <div key={user.id} className="border-b py-2">
                     <p><strong>Tên đăng nhập:</strong> {user.userName}</p>
                     <p><strong>Email:</strong> {user.email}</p>
                     <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                     <p><strong>Vai trò:</strong> {roleOptions.find((r) => r.value === Number(user.role))?.label || user.role}</p>
                     <p><strong>Trạng thái:</strong> {user.isBanned ? "Bị cấm" : "Hoạt động"}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </CardContent>
       </Card>
     );
   };
   
   export default GpFilter;
