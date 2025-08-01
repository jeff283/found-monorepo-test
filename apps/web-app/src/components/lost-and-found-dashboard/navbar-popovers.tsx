'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  UserPlus,
  ClipboardCheck,
  LogOut,
  Settings,
  User,
  FileText,
} from 'lucide-react';
import Image from 'next/image';

export function SearchPopover() {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
      <input
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-cyan-300"
        placeholder="Search something"
      />
      <div className="mt-4 text-xs text-gray-500 font-medium">RECENT SEARCHES</div>
      <ul className="text-sm text-gray-800 mt-1 space-y-2">
        <li className="py-1 border-b last:border-b-0">Black Dell laptop with sticker</li>
        <li className="py-1 border-b last:border-b-0">Lost ID card - James N.</li>
        <li className="py-1 border-b last:border-b-0">iPhone 13 blue found near cafeteria</li>
        <li className="py-1">Red Samsonite suitcase</li>
      </ul>
    </div>
  );
}

export function GridPopover() {
  const actions = [
    {
      icon: <Plus className="w-4 h-4 text-cyan-500" />,
      title: 'Log Found Item',
      desc: 'Quickly add a newly found item.',
    },
    {
      icon: <Search className="w-4 h-4 text-cyan-500" />,
      title: 'Search Lost Report',
      desc: 'Search reports for a lost item.',
    },
    {
      icon: <UserPlus className="w-4 h-4 text-cyan-500" />,
      title: 'Add New Agent',
      desc: 'Add a new team member or agent.',
    },
    {
      icon: <ClipboardCheck className="w-4 h-4 text-cyan-500" />,
      title: 'View Today’s Claims',
      desc: 'Check all claims submitted today.',
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
      <div className="text-sm font-semibold text-gray-900 mb-3">Quick actions</div>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <div key={index} className="flex gap-3 items-start py-1">
            <div className="bg-cyan-100 p-2 rounded-lg">{action.icon}</div>
            <div className="text-sm">
              <div className="font-medium text-gray-900 leading-tight">{action.title}</div>
              <div className="text-gray-500 text-xs">{action.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsPopover() {
  const notifications = Array(3).fill({
    user: 'hamza khan',
    item: 'id card lost near cafeteria',
    time: 'Yesterday 10:00 AM',
  });

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Notifications</div>
        <button className="text-xs text-cyan-600 hover:underline">Mark all read</button>
      </div>
      <ul className="text-sm divide-y divide-gray-200 mb-2">
        {notifications.map((n, i) => (
          <li key={i} className="py-2">
            <div>
              <strong className="capitalize">{n.user}</strong> reported {n.item}
            </div>
            <div className="text-gray-400 text-xs">{n.time}</div>
          </li>
        ))}
      </ul>
      <div className="text-center">
        <button className="text-xs text-cyan-600 hover:underline">View all notifications</button>
      </div>
    </div>
  );
}

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
