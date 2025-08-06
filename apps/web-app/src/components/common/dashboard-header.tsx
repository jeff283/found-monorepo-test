'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface DashboardHeaderProps {
  navItems: NavItem[];
  logo?: string;
  compact?: boolean;
  renderPopovers?: () => ReactNode;
  renderProfile?: () => ReactNode;
}

export function DashboardHeader({
  navItems,
  logo = '/default-logo.png',
  compact,
  renderPopovers,
  renderProfile,
}: DashboardHeaderProps) {
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

  return (
    <header
      className="flex items-center justify-between bg-white relative z-10"
      style={{
        paddingLeft: `max(env(safe-area-inset-left), ${compact ? '0.5rem' : '2rem'})`,
        paddingRight: `max(env(safe-area-inset-right), ${compact ? '0.5rem' : '2rem'})`,
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
        maxWidth: '80rem',
        margin: '0 auto',
      }}
    >
      {/* Left: Logo & Nav */}
      <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-8">
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
          src={logo}
          alt="Logo"
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

      {/* Right: Popovers & Profile */}
      <div className="flex items-center gap-3">
        {renderPopovers && renderPopovers()}
        {renderProfile && renderProfile()}
      </div>

      {/* Mobile Nav */}
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
