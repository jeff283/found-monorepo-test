"use client";

import { Mic } from "lucide-react";

import { cn } from "@/lib/utils";

interface IconRippleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon we want to have.
   */
  icon: React.ElementType;
  /**
   * Size of Icon
   */
  iconSize?: number;
  /**
   * Color of the Icon
   */
  iconColor?: string;
  /**
   * Border color that will have ripple animation
   */
  borderColor?: string;
  /**
   * Padding around the icon
   */
  inset?: string;
  /**
   * Animation duration in seconds
   */
  duration?: number;
}

export default function IconRipple({
  icon: Icon = Mic,
  iconSize = 24,
  iconColor = "#ddd",
  borderColor = "#ddd",
  inset = "10px",
  duration = 2,
}: IconRippleProps) {
  const customBorderStyle = {
    borderColor,
  };
  const insetStyle = {
    top: `-${inset}`,
    bottom: `-${inset}`,
    left: `-${inset}`,
    right: `-${inset}`,
  };

  // Custom animation style for smoother, slower ripple
  const animationStyle = {
    animation: `ripple ${duration}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  };

  return (
    <>
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className={cn("group relative flex items-center justify-center")}>
        <Icon size={iconSize} color={iconColor} />
        <div
          className={cn("absolute rounded-full border-2")}
          style={{ 
            ...customBorderStyle, 
            ...insetStyle, 
            ...animationStyle 
          }}
        />
      </div>
    </>
  );
}

IconRipple.displayName = "IconRipple";