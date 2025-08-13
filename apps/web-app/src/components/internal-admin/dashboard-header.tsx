'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  ClipboardList,
  Building2,
  BarChart3,
  Settings,
  // Search,
  // Bell,
  // Grid3X3,
  // MailCheck,
  Menu,
  X,
} from 'lucide-react';

import Image from 'next/image';
import FoundlyLogo from '@/assets/images/logos/Foundly Logo.png';
import { Button } from '@/components/ui/button';
import {
  SearchPopover,
  GridPopover,
  NotificationsPopover,
  ProfileDropdown,
} from '@/components/navbar-popovers';
import { MessagesSheet } from '@/components/navbar-popovers/messages-sheet';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface DashboardHeaderProps {
  user: User;
  compact?: boolean;
}

export function DashboardHeader({ user, compact }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerPadding = compact ? '0.5rem' : '1.5rem';
  const logoSize = compact ? 40 : 64;

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileNavOpen]);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/internal-admin/dashboard' },
    { icon: FileText, label: 'Found items', href: '/internal-admin/found-items' },
    { icon: ClipboardList, label: 'Claims', href: '/internal-admin/claims' },
    { icon: Building2, label: 'Institutions', href: '/internal-admin/institutions' },
    { icon: BarChart3, label: 'Reports', href: '/internal-admin/reports' },
    { icon: Settings, label: 'Settings', href: '/internal-admin/settings' },
  ];

  return (
    <header
      className="flex items-center justify-between bg-white border-b border-muted relative z-10"
      style={{
        paddingLeft: compact ? 'max(env(safe-area-inset-left), 0.5rem)' : 'max(env(safe-area-inset-left), 2rem)',
        paddingRight: compact ? 'max(env(safe-area-inset-right), 0.5rem)' : 'max(env(safe-area-inset-right), 2rem)',
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
        maxWidth: '80rem',
        margin: '0 auto',
      }}
    >
      {/* Left: Logo + Navigation */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
        </button>

        {/* Logo */}
        <Image
          src={FoundlyLogo}
          alt="Foundly Logo"
          height={logoSize}
          className="object-contain h-15 w-auto"
          priority
        />

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Right: Utilities */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="rounded-lg">
          <SearchPopover />
        </div>

        {/* Grid */}
        <div className="rounded-lg">
          <GridPopover />
        </div>

        {/* Messages */}
        <div className="rounded-lg">
          <MessagesSheet />
        </div>

        {/* Notifications */}
        <div className="rounded-lg">
          <NotificationsPopover />
        </div>

        {/* Profile */}
        <ProfileDropdown user={user}>
          <button className="flex items-center gap-2 focus:outline-none rounded-lg">
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              width={40}
              height={40}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
            />
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="button-text-small text-black truncate">{user.name}</span>
              <span className="caption-small text-muted-foreground flex items-center gap-1">
                {user.role}
                <span className="text-primary text-xs">✔</span>
              </span>
            </div>
          </button>
        </ProfileDropdown>
      </div>
    </header>
  );
}
