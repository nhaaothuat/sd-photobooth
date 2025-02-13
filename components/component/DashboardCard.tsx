import { Card, CardContent } from "@/components/ui/card";

import { LucideIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardCardProps {
     title: string;
     count: number;
     icon: React.ReactElement<LucideIcon>;
     color?: string;
}

const DashboardCard = ({ title, count, icon,color }: DashboardCardProps) => {
     return (
          // <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
          //      <CardContent>
          //           <h3 className="text-3xl text-center mb-4 font-bold text-slate-500 dark:text-slate-200">
          //                {title}
          //           </h3>
          //           <div className="flex gap-5 justify-center items-center">
          //                {icon}
          //                <h3 className="text-5xl font-semibold text-slate-500 dark:text-slate-200">
          //                     {count}
          //                </h3>
          //           </div>
          //      </CardContent>
          // </Card>
          <Card className="p-4 pb-0 bg-white dark:bg-slate-800  ">
               <CardContent className="flex items-center justify-between gap-4">
                    {/* Ảnh avatar */}
                    <div className={` rounded-full shadow-lg ${color}`}>
                         {icon}
                    </div>
                   

                    {/* Nội dung chính */}
                    <div>
                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {title}
                         </span>
                         <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                              {count}
                         </h3>
                    </div>
               </CardContent>
          </Card>
     )
}

export default DashboardCard
