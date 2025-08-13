"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function AddInstitutionPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-primary text-white rounded-lg flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Add institution
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="rounded-xl w-[340px] sm:w-[380px] p-4 shadow-lg space-y-4 border bg-white"
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">Add Institution</div>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Institution Name</label>
            <Input type="text" placeholder="Enter institution name" className="w-full" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" placeholder="Enter email address" className="w-full" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <div className="flex gap-2">
              <select className="w-[22%] border rounded-md text-sm px-2 py-2 bg-background text-foreground">
                <option value="+254">+254</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+61">+61</option>
                <option value="+81">+81</option>
                <option value="+33">+33</option>
              </select>
              <Input type="tel" placeholder="Enter phone number" className="flex-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input type="text" placeholder="Enter location" className="w-full" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select className="w-full text-sm border rounded-md px-3 py-2 text-foreground bg-background">
              <option value="">Select category</option>
              <option value="University">University</option>
              <option value="Government Office">Government Office</option>
              <option value="Hospital">Hospital</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-2 gap-2">
          <Button
            variant="ghost"
            className="w-1/2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-1/2 bg-primary text-white text-sm">
            + Add institution
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
