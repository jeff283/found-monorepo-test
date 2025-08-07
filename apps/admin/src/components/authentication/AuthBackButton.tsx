"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthBackButtonProps {
  href?: string;
}

export default function AuthBackButton({ href }: AuthBackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-1 caption text-foreground hover:underline"
      >
        <ChevronLeft size={18} />
        Back
      </Link>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 caption text-foreground hover:underline"
    >
      <ChevronLeft size={18} />
      Back
    </button>
  );
}
