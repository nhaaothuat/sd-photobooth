import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from "./Sidebar"
import { IoTabletLandscapeOutline } from "react-icons/io5";

const SidebarTrigger = () => {
  return (

    <Sheet  >
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-white via-gray-50 to-gray-50 animate-gradient ">
        <SheetTrigger className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-110 hover:bg-gray-200">
          <IoTabletLandscapeOutline />
        </SheetTrigger>
      </div>
      <SheetContent side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
   

  )
}

export default SidebarTrigger
