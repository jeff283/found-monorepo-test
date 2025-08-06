'use client';

import { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ConversationView } from './conversation-view';

interface Message {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
    status: string;
  };
  message: string;
  time: string;
  badge?: string;
  isTyping?: boolean;
}

export function MessagesSheet() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);

  const messages: Message[] = [
    {
      id: '1',
      user: { name: 'Winnie Otieno', initials: 'WO', status: 'online' },
      message: 'I think I saw the phone at the front desk.',
      time: '8:22 AM',
      badge: '03',
    },
    {
      id: '2',
      user: { name: 'Security Office', initials: 'SO', status: 'typing...' },
      message: 'Security is typing...',
      time: '9:01 AM',
      badge: '...',
      isTyping: true,
    },
    {
      id: '3',
      user: { name: 'Brian Mutua', initials: 'BM', status: 'away' },
      message: 'Did you find my blue backpack near the lecture hall?',
      time: 'Yesterday',
      badge: '01',
    },
    {
      id: '4',
      user: { name: 'Reception - Hall A', initials: 'RA', status: 'online' },
      message: 'We’ve stored the wallet in drawer 2.',
      time: '11:45 AM',
      badge: '02',
    },
    {
      id: '5',
      user: { name: 'Sandra Kiptoo', initials: 'SK', status: 'offline' },
      message: 'Thanks for confirming the ID is mine!',
      time: '10:02 AM',
      badge: '',
    },
    {
      id: '6',
      user: { name: 'Facilities Team', initials: 'FT', status: 'online' },
      message: 'We picked up a laptop from Science Block.',
      time: 'Mon 3:17 PM',
      badge: '04',
    },
    {
      id: '7',
      user: { name: 'Kalisa John', initials: 'KJ', status: 'online' },
      message: 'Just matched a claim with your wallet.',
      time: 'Sun 4:56 PM',
      badge: '01',
    },
    {
      id: '8',
      user: { name: 'Aisha Mohammed', initials: 'AM', status: 'typing...' },
      message: 'Aisha is typing...',
      time: '11:03 AM',
      badge: '',
      isTyping: true,
    },
    {
      id: '9',
      user: { name: 'Lost & Found Bot', initials: 'LF', status: 'online' },
      message: 'Reminder: 1 item unclaimed in your location.',
      time: 'Today 7:00 AM',
      badge: '01',
    },
    {
      id: '10',
      user: { name: 'Derrick Owino', initials: 'DO', status: 'away' },
      message: 'Where can I pick up the flash drive?',
      time: 'Yesterday 2:30 PM',
      badge: '',
    },
    {
      id: '11',
      user: { name: 'Campus Security', initials: 'CS', status: 'online' },
      message: 'Pickup confirmation received for claim ID 8723.',
      time: 'Thu 5:15 PM',
      badge: '02',
    },
    {
      id: '12',
      user: { name: 'Janet Wairimu', initials: 'JW', status: 'offline' },
      message: 'Was the phone turned in to reception?',
      time: 'Wed 9:18 PM',
      badge: '',
    },
    {
      id: '13',
      user: { name: 'Main Library Desk', initials: 'ML', status: 'online' },
      message: 'Student ID has been matched successfully.',
      time: 'Tue 10:07 AM',
      badge: '01',
    },
    {
      id: '14',
      user: { name: 'Kevin Ndung’u', initials: 'KN', status: 'online' },
      message: 'Hey, the match details look promising.',
      time: 'Today 3:45 PM',
      badge: '01',
    },
    {
      id: '15',
      user: { name: 'Miriam Atieno', initials: 'MA', status: 'away' },
      message: 'Let me confirm with the staff then I’ll reply.',
      time: 'Mon 12:25 PM',
      badge: '',
    },
  ];

  const filteredMessages = messages.filter(
    (message) =>
      message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (message: Message) => {
    setSelectedConversation(message);
  };

  const handleBackToMessages = () => {
    setSelectedConversation(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-lg hover:bg-gray-100"
        >
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[487px] p-0 border-l border-gray-200"
      >
        {selectedConversation ? (
          <ConversationView
            user={selectedConversation.user}
            onBack={handleBackToMessages}
          />
        ) : (
          <>
            {/* Header */}
            <SheetHeader className="px-[33px] py-[28px] border-b border-gray-100">
              <SheetTitle className="text-xl font-semibold text-[#474747]">
                Messages
              </SheetTitle>
            </SheetHeader>
            
            {/* Search Input */}
            <div className="px-[33px] pt-6 pb-[26px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9b9b9b]" />
                <Input
                  placeholder="Search message/ User"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#f8f8f8] border-[#dfdfdf] focus:border-[#00bfcf] focus:ring-[#00bfcf] rounded-lg"
                />
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto px-[20px] pb-[20px]">
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="w-[320px] h-[52px] flex items-start gap-2 bg-white border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg p-2"
                    onClick={() => handleMessageClick(message)}
                  >
                    <UserAvatar
                      name={message.user.name}
                      imageUrl={message.user.avatar}
                      className="w-8 h-8 bg-[#dfc986] flex-shrink-0 rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-[#474747] truncate">
                          {message.user.name}
                          {message.user.name.includes('john') && (
                            <span className="ml-1 text-[10px] text-[#9b9b9b]">Admin</span>
                          )}
                        </span>
                        <span className="text-[10px] text-[#9b9b9b] flex-shrink-0 ml-2">
                          {message.time}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${
                        message.isTyping 
                          ? 'text-[#00bfcf] italic' 
                          : 'text-[#9b9b9b]'
                      }`}>
                        {message.message}
                      </p>
                    </div>

                    {message.badge && (
                      <div className="text-[10px] font-medium text-[#00bfcf] flex-shrink-0">
                        {message.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
