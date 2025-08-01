import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { User, Settings, FileText, LogOut } from 'lucide-react';

export function ProfileDropdown({
  user,
  children,
}: {
  user: { name: string; role: string; avatar?: string };
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {children ? (
          children
        ) : (
          <div className="flex items-center gap-2">
            <Image
              src={user.avatar || '/avatars/avatar-1.webp'}
              alt={user.name}
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-sm font-medium text-black truncate">{user.name}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                {user.role}
                <span className="text-cyan-500">✔</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
          <div className="mb-3">
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-500 text-xs">
              {user.role} <span className="text-cyan-500">✔</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
              <User className="w-4 h-4" />
              My profile
            </div>
            <div className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </div>
            <div className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
              <FileText className="w-4 h-4" />
              Reports
            </div>
            <div className="flex items-center gap-2 text-red-500 hover:text-red-700 cursor-pointer pt-2 border-t">
              <LogOut className="w-4 h-4" />
              Log out
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
