"use client";

import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export default function AuthInput({ icon: Icon, ...props }: AuthInputProps) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon size={18} />
        </div>
      )}
      <input
        {...props}
        className={`w-full h-[49px] border border-input rounded-md outline-none placeholder:text-gray-400 placeholder:font-normal caption focus:ring-2 focus:ring-ring ${
          Icon ? "pl-10 pr-4" : "px-4"
        }`}
      />
    </div>
  );
}
