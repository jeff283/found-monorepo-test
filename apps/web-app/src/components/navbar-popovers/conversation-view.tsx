'use client';

import { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Send, Paperclip, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/user-avatar';
import Image from 'next/image';
import phoneImg from '@/assets/images/logos/Items/phone.jpg';
import macbookImg from '@/assets/images/logos/Items/Macbook.jpg';


interface ConversationMessage {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'text' | 'image';
  images?: string[];
}

interface ConversationViewProps {
  user: {
    name: string;
    initials: string;
    status: string;
    avatar?: string;
  };
  onBack: () => void;
}

export function ConversationView({ user, onBack }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState('');

  const messages: ConversationMessage[] = [
    {
      id: '1',
      content: 'Hi, I lost a phone near the cafeteria. Was one turned in today?',
      timestamp: 'Mon 9:15 AM',
      isOwn: false,
      type: 'text'
    },
    {
      id: '2',
      content: 'Yes, we have a black Samsung Galaxy in storage. Can you confirm the wallpaper?',
      timestamp: 'Mon 9:17 AM',
      isOwn: true,
      type: 'text'
    },
    {
      id: '3',
      content: 'It has a photo of a dog wearing sunglasses.',
      timestamp: '',
      isOwn: false,
      type: 'text'
    },
    {
      id: '4',
      content: 'Sounds like a match! Please come to the main office with your ID.',
      timestamp: '',
      isOwn: true,
      type: 'text'
    },
    {
      id: '5',
      content: 'Thanks. I’ll head over in the next 20 minutes.',
      timestamp: '',
      isOwn: false,
      type: 'text'
    },
    {
      id: '6',
      content: '',
      timestamp: '',
      isOwn: true,
      type: 'image',
      images: [
        phoneImg.src,
        macbookImg.src
      ]
    },
    {
      id: '7',
      content: 'These are internal photos for reference. Please don’t share publicly.',
      timestamp: '',
      isOwn: true,
      type: 'text'
    },
    {
      id: '8',
      content: 'Understood. Appreciate the help!',
      timestamp: '',
      isOwn: false,
      type: 'text'
    },
    {
      id: '9',
      content: 'You’re welcome. Marking this as “Ready for pickup.”',
      timestamp: '',
      isOwn: true,
      type: 'text'
    },
    {
      id: '10',
      content: 'See you shortly!',
      timestamp: '',
      isOwn: false,
      type: 'text'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-[33px] py-[20px] border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <UserAvatar
            name={user.name}
            imageUrl={user.avatar}
            className="w-10 h-10 bg-[#dfc986] rounded-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#474747]">{user.name}</span>
              <span className="text-xs text-[#9b9b9b]">Admin</span>
            </div>
            <span className="text-xs text-[#00bfcf]">{user.status}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-[33px] py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[280px] ${message.isOwn ? 'order-2' : 'order-1'}`}>
              {message.type === 'text' && message.content && (
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-[#00bfcf] text-white rounded-br-md'
                      : 'bg-gray-100 text-[#474747] rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              )}
              
              {message.type === 'image' && message.images && (
                <div className="flex gap-2">
                  {message.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Attachment ${index + 1}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {message.timestamp && (
                <p className="text-xs text-[#9b9b9b] mt-1 px-2">
                  {message.timestamp}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-[33px] py-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            <Paperclip className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            <ImageIcon className="h-4 w-4 text-gray-500" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10 rounded-full border-gray-200 focus:border-[#00bfcf] focus:ring-[#00bfcf]"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-[#00bfcf] hover:bg-[#00a5b8]"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
