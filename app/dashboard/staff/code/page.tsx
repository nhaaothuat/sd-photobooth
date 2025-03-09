"use client"
import React from "react";
import TableTest1 from "@/components/component/TableTest1";
import TableTest2 from "@/components/component/TableTest2";
import { Title } from "@mantine/core";

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
import { Button } from "@/components/ui/button";

const SessionCode = () => {


     return (
          <div className="grid gap-4">
               {/* Tiêu đề */}
               <div className="flex justify-between">
                    <Title >Session Code</Title>
                    <Dialog>
                         <DialogTrigger asChild>
                              <Button variant="outline">Add</Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                   <DialogTitle>Add</DialogTitle>
                                   <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="">
                                   <div className=" items-center gap-4">
                                        <Label htmlFor="name" >
                                             Session Code
                                        </Label>
                                        <Input id="name" value="" className="col-span-3" />
                                   </div>
                                  
                              </div>
                              <DialogFooter>
                                   <Button type="submit">Save changes</Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
               </div>


               {/* Chia cột Grid để hai bảng nằm cạnh nhau */}
               <div className="grid grid-cols-2 gap-4">
                    <div>
                         <TableTest1 />
                    </div>
                    <div>
                         <TableTest2 />
                    </div>
               </div>
          </div>
     );
};

export default SessionCode;
