// "use client";

// import React from "react";
// import Link from "next/link";
// import { ArrowUpRight } from "lucide-react";
// import { cn } from "./utils";

// export function FoundlyButton({
//   text,
//   href = "#",
//   className,
//   variant = "default",
//   as = "link",
//   type = "button",
//   disabled,
//   target,
//   rel,
//   children,
//   ...props
// }: {
//   text?: string;
//   href?: string;
//   className?: string;
//   variant?: "default" | "secondary" | "outline" | "ghost";
//   as?: "link" | "button";
//   type?: "submit" | "button";
//   target?: string;
//   rel?: string;
//   children?: React.ReactNode;
// } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
//   const baseStyles =
//     "ui:relative ui:inline-flex ui:items-center ui:justify-center ui:rounded-full ui:px-6 ui:py-3 ui:button-text ui:transition-all ui:duration-200 focus:ui:outline-none focus:ui:ring-2 focus:ui:ring-offset-2 ui:group";

//   const variants = {
//     default:
//       "ui:bg-primary ui:text-primary-foreground hover:ui:opacity-90 active:ui:opacity-90 focus:ui:ring-ring",
//     secondary:
//       "ui:bg-secondary ui:text-secondary-foreground hover:ui:opacity-90 active:ui:opacity-90 focus:ui:ring-ring",
//     outline:
//       "ui:border-2 ui:border-primary ui:text-primary hover:ui:bg-primary hover:ui:text-primary-foreground active:ui:bg-primary active:ui:text-primary-foreground focus:ui:ring-ring",
//     ghost:
//       "ui:text-primary hover:ui:bg-accent hover:ui:text-accent-foreground active:ui:bg-accent active:ui:text-accent-foreground focus:ui:ring-ring",
//   };

//   const arrowBackgrounds = {
//     default: "ui:bg-secondary/80 ui:backdrop-blur-sm",
//     secondary: "ui:bg-primary/80 ui:backdrop-blur-sm",
//     outline:
//       "ui:bg-primary/10 ui:border ui:border-primary/20 group-hover:ui:bg-secondary group-hover:ui:border-primary/30 group-active:ui:bg-secondary group-active:ui:border-primary/30",
//     ghost:
//       "ui:bg-secondary/10 group-hover:ui:bg-secondary/50 group-active:ui:bg-secondary/50 ui:backdrop-blur-sm",
//   };

//   const arrowColors = {
//     default: "ui:text-secondary-foreground",
//     secondary: "ui:text-primary-foreground",
//     outline:
//       "ui:text-primary group-hover:ui:text-primary-foreground group-active:ui:text-primary-foreground",
//     ghost:
//       "ui:text-primary group-hover:ui:text-secondary-foreground group-active:ui:text-secondary-foreground",
//   };

//   const content = (
//     <>
//       <div
//         className={cn(
//           "ui:absolute ui:right-2 ui:flex ui:h-8 ui:w-8 ui:items-center ui:justify-center ui:rounded-full ui:transition-all ui:duration-200",
//           arrowBackgrounds[variant]
//         )}
//       >
//         <ArrowUpRight
//           className={cn(
//             "ui:h-4 ui:w-4 ui:transition-all ui:duration-500 ui:ease-out group-hover:ui:rotate-[45deg] group-active:ui:rotate-[45deg] ui:transform-gpu",
//             arrowColors[variant]
//           )}
//           strokeWidth={2}
//         />
//       </div>
//       <span className="ui:mr-6 ui:text-center ui:flex-1">
//         {children ? (
//           typeof children === "string" ? (
//             children
//           ) : (
//             <>
//               {text}
//               {children}
//             </>
//           )
//         ) : (
//           text
//         )}
//       </span>
//     </>
//   );

//   const customStyle =
//     variant === "default"
//       ? { backgroundColor: "#00bfcf", color: "#fff" }
//       : undefined;

//   if (as === "button") {
//     return (
//       <button
//         type={type}
//         disabled={disabled}
//         className={cn(
//           baseStyles,
//           variants[variant],
//           disabled &&
//             "ui:opacity-50 ui:cursor-not-allowed ui:pointer-events-none",
//           className
//         )}
//         style={customStyle}
//         {...props}
//       >
//         {content}
//       </button>
//     );
//   }

//   return (
//     <Link
//       href={href}
//       className={cn(baseStyles, variants[variant], className)}
//       target={target}
//       rel={rel}
//       style={customStyle}
//       onClick={
//         props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
//       }
//     >
//       {content}
//     </Link>
//   );
// }
