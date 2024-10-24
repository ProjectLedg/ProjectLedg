import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { MessageSquarePlus, UserPlus, Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Mock notifications data
const notifications = [
  { id: 1, message: "New message from John", time: "5 min ago" },
  { id: 2, message: "Your report is ready", time: "1 hour ago" },
  { id: 3, message: "Meeting scheduled for tomorrow", time: "3 hours ago" },
]

export default function NavbarButtons({ isChatOpen, toggleChat }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Button
        variant="outline"
        onClick={toggleChat}
        className={`
          relative overflow-hidden transition-all duration-300 ease-in-out
          px-4 py-2 rounded-full font-medium text-sm
          ${isChatOpen 
            ? 'bg-green-500 text-white border-green-500' 
            : 'bg-white text-green-500 border-green-300 hover:bg-green-50'}
        `}
      >
        <MessageSquarePlus className="h-5 w-5 mr-2 inline-block" />
        Fråga AI
        <span className="sr-only">Öppna AI-chatt</span>
      </Button>
      <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="
              relative overflow-hidden transition-all duration-300 ease-in-out
              hover:bg-gray-100 text-gray-600 hover:text-gray-800
            "
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Visa notiser</span>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h3 className="font-medium leading-none">Notiser</h3>
            <div className="grid gap-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-4 rounded-md p-2 hover:bg-gray-100">
                  <Bell className="mt-1 h-5 w-5 text-gray-500" />
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}