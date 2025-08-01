import { FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // if you're using class merging

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ name, imageUrl, className }) => {
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "bg-muted flex items-center justify-center text-xs font-bold text-white overflow-hidden",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={59}
          height={59}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};
