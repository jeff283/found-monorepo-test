import React from 'react';
import { Plus, Search, UserPlus, ClipboardCheck, LayoutGrid } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { useRouter } from "next/navigation";

export function GridPopover() {
  const router = useRouter();

  const handleLogFoundItem = () => {
    // Navigate to found items page and open modal via query param
    router.push("/institution/found-items?reportFound=true");
  };
  const handleSearchLostReport = () => {
    alert('Search Lost Report action triggered');
  };
  const handleAddNewAgent = () => {
    router.push("/institution/agents?addAgent=true");
  };
  const handleViewTodaysClaims = () => {
    alert('View Today’s Claims action triggered');
  };

  const actions = [
    {
      icon: <Plus className="w-4 h-4 text-cyan-500" />,
      title: 'Log Found Item',
      desc: 'Quickly add a newly found item.',
      onClick: handleLogFoundItem,
    },
    {
      icon: <Search className="w-4 h-4 text-cyan-500" />,
      title: 'Search Lost Report',
      desc: 'Search reports for a lost item.',
      onClick: handleSearchLostReport,
    },
    {
      icon: <UserPlus className="w-4 h-4 text-cyan-500" />,
      title: 'Add New Agent',
      desc: 'Add a new team member or agent.',
      onClick: handleAddNewAgent,
    },
    {
      icon: <ClipboardCheck className="w-4 h-4 text-cyan-500" />,
      title: 'View Today’s Claims',
      desc: 'Check all claims submitted today.',
      onClick: handleViewTodaysClaims,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Open grid popover" className="bg-transparent p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <LayoutGrid className="w-5 h-5 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100">
        <div className="text-sm font-semibold text-gray-900 mb-3">Quick actions</div>
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex gap-3 items-start py-2 px-2 rounded-lg hover:bg-cyan-50 transition text-left"
              onClick={action.onClick}
              type="button"
            >
              <div className="bg-cyan-100 p-2 rounded-lg">{action.icon}</div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 leading-tight">{action.title}</div>
                <div className="text-gray-500 text-xs">{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
