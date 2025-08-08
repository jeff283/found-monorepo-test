"use client";

import { Suspense } from "react";
import { User, CreditCard, Lock, Shield, Trash2, LogOut, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  defaultUser,
  defaultNavItems,
  ProfileDropdownContent,
} from "@/components/institution-dashboard/dashboard-header.config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TabsRouter from "@/components/institution-dashboard/profile/TabsRouter";
import { useSearchParams } from "next/navigation";

const sidebarItems = [
  { label: "My profile", icon: User, path: "profile" },
  { label: "Payment and billings", icon: CreditCard, path: "billing" },
  { label: "Sign-in Methods", icon: Lock, path: "signin" },
  { label: "Account privacy", icon: Shield, path: "privacy" },
  { label: "Sign out", icon: LogOut, path: "logout" },
  { label: "Delete account", icon: Trash2, path: "delete", destructive: true },
];

const allowedTabs = sidebarItems.map((item) => item.path);

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = tabParam && allowedTabs.includes(tabParam) ? tabParam : "profile";

  // Get label for current tab
  const currentTabLabel =
    sidebarItems.find((item) => item.path === tab)?.label || "Account settings";

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        user={defaultUser}
        navItems={defaultNavItems}
        profileDropdown={ProfileDropdownContent(defaultUser)}
        compact
      />

      {/* Breadcrumb */}
       <div
        className="absolute"
        style={{ width: 366, height: 24, top: 80, left: 122, gap: 12, opacity: 1 }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/institution/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/institution/profile">Account settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">{currentTabLabel}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div
        className="absolute flex"
        style={{
          width: 1304,
          height: 634,
          top: 110,
          left: 104,
          borderRadius: 12,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#e5e7eb",
          padding: 16,
          gap: 24,
          opacity: 1,
          background: "#fff",
        }}
      >
        {/* Sidebar */}
        <aside style={{ width: 240, flexShrink: 0 }}>
          <nav className="space-y-1">
            {sidebarItems.map(({ label, icon: Icon, path, destructive }) => (
              <Link
                key={path}
                href={`?tab=${path}`}
                style={{ height: 40 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  destructive
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="pt-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
                HELP
              </div>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <HelpCircle size={18} />
                Foundly Support
              </Link>
            </div>
          </nav>
        </aside>

        {/* Divider */}
        <div
          style={{
            width: 0,
            height: 602,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            opacity: 1,
            marginRight: 24,
          }}
        />

        {/* Main */}
        <main style={{ flex: 1 }}>
          <TabsRouter tab={tab} />
        </main>
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  );
}
