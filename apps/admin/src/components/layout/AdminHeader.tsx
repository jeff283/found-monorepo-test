"use client";

import { Bell, Search, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="headline-1 text-gray-900">Foundly Admin</span>
            </div>
            <h1 className="headline-2 text-gray-700">{title}</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors">
              <User className="w-4 h-4" />
              <span className="body-small font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
