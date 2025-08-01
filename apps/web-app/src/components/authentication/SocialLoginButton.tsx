"use client";

import { ComponentType } from "react";
import { IconBaseProps } from "react-icons";

interface SocialLoginButtonProps {
  icon: ComponentType<IconBaseProps>;
  text: string;
  onClick: () => void;
}

export default function SocialLoginButton({
  icon: Icon,
  text,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full justify-center gap-3 border border-border rounded-full py-2 caption text-foreground hover:bg-muted transition mb-3"
    >
      <Icon size={24} />
      {text}
    </button>
  );
}
