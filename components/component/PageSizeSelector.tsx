"use client";

import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";

interface PageSizeSelectorProps {
     value: number;
     onChange: (value: number) => void;
     options?: number[];
     placeholder?: string;
}

export const PageSizeSelector = ({
     value,
     onChange,
     options = [5, 10, 15, 20],
     placeholder = "Rows per page",
}: PageSizeSelectorProps) => {
     return (
          <div className="mb-3 flex justify-end">
               <Select
                    value={value.toString()}
                    onValueChange={(val) => onChange(Number(val))}
               >
                    <SelectTrigger className="w-[90px] h-[40px] rounded-full border border-gray-300 bg-white px-4 py-2 shadow-md transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                         <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-200 shadow-lg bg-white" >
                         {options.map((option) => (
                              <SelectItem key={option} value={option.toString()} className="cursor-pointer rounded-md px-4 py-2 text-sm hover:bg-blue-100 focus:bg-blue-100">
                                   {option}
                              </SelectItem>
                         ))}
                    </SelectContent>
               </Select>
          </div>
     );
};