"use client";

import { MoreVertical } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card } from "@/components/ui/card";

export interface InstitutionCardProps {
  name: string;
  email: string;
  location: string;
  branches: number;
  avatarUrl?: string;
}

export default function InstitutionCard({
  name,
  email,
  location,
  branches,
  avatarUrl,
}: InstitutionCardProps) {
  return (
    <Card
      className="rounded-2xl p-4 md:p-6 bg-white border border-border shadow-sm transition hover:shadow-md"
      style={{
        width: "100%",
        maxWidth: "421.67px",
        minWidth: "280px",
        height: "209px",
        flexGrow: 1,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <UserAvatar
            name={name}
            imageUrl={avatarUrl}
            className="w-[59px] h-[59px] rounded-[12px]"
          />
          <div>
            <p className="body-1 font-semibold text-foreground">{name}</p>
            <p className="caption text-muted-foreground">{email}</p>
          </div>
        </div>
        <MoreVertical className="text-muted-foreground w-5 h-5" />
      </div>

      <hr className="border-muted mb-4" />

      <div className="flex justify-between text-sm">
        <div>
          <p className="caption text-muted-foreground mb-1">Location</p>
          <p className="body-1">{location}</p>
        </div>
        <div>
          <p className="caption text-muted-foreground mb-1">Branches</p>
          <p className="body-1">{branches}</p>
        </div>
      </div>
    </Card>
  );
}
