"use client";

import { Search, Bell, Home, Building2, BarChart3, User } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/admin/lib/utils";
import images from "@/admin/constants/images";

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function AdminHeader({
  onSearch,
  searchPlaceholder = "Search...",
}: AdminHeaderProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
      disabled: false,
    },

    {
      name: "Applications",
      href: "/applications",
      icon: Building2,
      current: pathname.startsWith("/applications"),
      disabled: false,
    },
    {
      name: "Reports",
      href: "#",
      icon: BarChart3,
      current: false,
      disabled: true,
    },
    {
      name: "User Management",
      href: "#",
      icon: User,
      current: false,
      disabled: true,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src={images.foundlyLogo}
                alt="Foundly Logo"
                height={32}
                className="object-contain h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="w-80 pl-10 border-gray-300 rounded-lg bg-white focus:border-cyan-500 focus:ring-cyan-500"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 relative"
            >
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Profile */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "rounded-lg border-gray-200 shadow-lg",
                  userButtonPopoverActions: "rounded-lg",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
