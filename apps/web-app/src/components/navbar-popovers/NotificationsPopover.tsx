import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(
    Array(3).fill({
      user: 'hamza khan',
      item: 'id card lost near cafeteria',
      time: 'Yesterday 10:00 AM',
    })
  );

  const handleMarkAllRead = () => {
    setNotifications([]);
    toast.success('All notifications marked as read');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Open notifications popover" className="bg-transparent p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <Bell className="w-5 h-5 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Notifications</div>
          <button className="text-xs text-cyan-600 hover:underline" onClick={handleMarkAllRead} type="button">
            Mark all read
          </button>
        </div>
        {notifications.length > 0 ? (
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
        ) : (
          <div className="text-center text-muted-foreground py-6 text-sm">
            All notifications are read.
          </div>
        )}
        <div className="text-center">
          <button className="text-xs text-cyan-600 hover:underline">View all notifications</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
