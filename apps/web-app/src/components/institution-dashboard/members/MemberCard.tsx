"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface MemberCardProps {
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
  avatarUrl?: string | null;
}

export default function MemberCard({
  name,
  email,
  role,
  joinedAt,
  avatarUrl,
}: MemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "org:admin":
        return "Admin";
      case "org:member":
        return "Member";
      default:
        return role.replace("org:", "");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "org:admin":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "org:member":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl || undefined} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm truncate">{name}</h3>
              <Badge
                variant="secondary"
                className={`text-xs ${getRoleColor(role)}`}
              >
                {getRoleDisplay(role)}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground truncate mb-2">
              {email}
            </p>

            <p className="text-xs text-muted-foreground">
              Joined {formatDistanceToNow(joinedAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
