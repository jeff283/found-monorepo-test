'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FoundlyLogo from '@/assets/images/logos/Foundly Logo.png';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export interface User {
  name: string;
  role: string;
  avatar?: string;
}

export interface DashboardHeaderProps {
  user: User;
  navItems?: NavItem[];
  profileDropdown?: ReactNode;
  compact?: boolean;
}

export function DashboardHeader({
  user,
  navItems = [],
  profileDropdown,
  compact,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const headerPadding = compact ? '0.5rem' : '1.5rem';
  const logoSize = compact ? 40 : 64;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileNavOpen]);

  const toggleMobileNav = () => setMobileNavOpen(!mobileNavOpen);

  return (
    <header
      className="flex items-center justify-between bg-white relative z-10"
      style={{
        paddingLeft: compact ? 'max(env(safe-area-inset-left), 0.5rem)' : 'max(env(safe-area-inset-left), 2rem)',
        paddingRight: compact ? 'max(env(safe-area-inset-right), 0.5rem)' : 'max(env(safe-area-inset-right), 2rem)',
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
        maxWidth: '80rem',
        margin: '0 auto',
      }}
    >
      <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-8">
        <button
          className="lg:hidden p-2"
          onClick={toggleMobileNav}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileNavOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <Image
          src={FoundlyLogo}
          alt="Foundly Logo"
          height={logoSize}
          width={logoSize}
          className="object-contain h-10 md:h-14 w-auto"
          priority
        />

        <nav className="hidden lg:flex items-center space-x-3">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium ${
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

      <div className="flex items-center gap-3">
        {profileDropdown ? (
          profileDropdown
        ) : (
          <button className="flex items-center gap-2 focus:outline-none">
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="button-text-small text-black truncate">{user.name}</span>
              <span className="caption-small text-muted-foreground flex items-center gap-1">
                {user.role}
                <span className="text-primary text-xs">✔</span>
              </span>
            </div>
          </button>
        )}
      </div>

      {mobileNavOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md lg:hidden z-20">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => {
                  router.push(item.href);
                  setMobileNavOpen(false);
                }}
                className={`justify-start gap-2 text-sm w-full ${
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
      )}
    </header>
  );
}
