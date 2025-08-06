"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/admin/lib/utils";

interface FoundlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  href?: string;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  as?: "link" | "button";
  type?: "submit" | "button";
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

const FoundlyButton: React.FC<FoundlyButtonProps> = ({
  text,
  href = "#",
  className,
  variant = "default",
  as = "link",
  type = "button",
  disabled,
  target,
  rel,
  children,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-full px-6 py-3 button-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 group";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:opacity-90 active:opacity-90 focus:ring-ring",
    secondary:
      "bg-secondary text-secondary-foreground hover:opacity-90 active:opacity-90 focus:ring-ring",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground focus:ring-ring",
    ghost:
      "text-primary hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground focus:ring-ring",
  };

  const arrowBackgrounds = {
    default: "bg-secondary/80 backdrop-blur-sm",
    secondary: "bg-primary/80 backdrop-blur-sm",
    outline:
      "bg-primary/10 border border-primary/20 group-hover:bg-secondary group-hover:border-primary/30 group-active:bg-secondary group-active:border-primary/30",
    ghost:
      "bg-secondary/10 group-hover:bg-secondary/50 group-active:bg-secondary/50 backdrop-blur-sm",
  };

  const arrowColors = {
    default: "text-secondary-foreground",
    secondary: "text-primary-foreground",
    outline:
      "text-primary group-hover:text-primary-foreground group-active:text-primary-foreground",
    ghost:
      "text-primary group-hover:text-secondary-foreground group-active:text-secondary-foreground",
  };

  const content = (
    <>
      <div
        className={cn(
          "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
          arrowBackgrounds[variant]
        )}
      >
        <ArrowUpRight
          className={cn(
            "h-4 w-4 transition-all duration-500 ease-out group-hover:rotate-[45deg] group-active:rotate-[45deg] transform-gpu",
            arrowColors[variant]
          )}
          strokeWidth={2}
        />
      </div>
      <span className="mr-6 text-center flex-1">
        {children ? (
          typeof children === "string" ? (
            children
          ) : (
            <>
              {text}
              {children}
            </>
          )
        ) : (
          text
        )}
      </span>
    </>
  );

  const customStyle =
    variant === "default"
      ? { backgroundColor: "#00bfcf", color: "#fff" }
      : undefined;

  if (as === "button") {
    return (
      <button
        type={type}
        disabled={disabled}
        className={cn(
          baseStyles,
          variants[variant],
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        style={customStyle}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={cn(baseStyles, variants[variant], className)}
      target={target}
      rel={rel}
      style={customStyle}
      onClick={
        props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
      }
    >
      {content}
    </Link>
  );
};

export default FoundlyButton;
