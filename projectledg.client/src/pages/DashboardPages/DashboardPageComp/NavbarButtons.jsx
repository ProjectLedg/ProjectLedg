import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { SquarePen, Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Mock notifications data
const notifications = [
  { id: 1, message: "New message from John", time: "5 min ago", isNew: true },
  { id: 2, message: "Your report is ready", time: "1 hour ago", isNew: true },
  { id: 3, message: "Meeting scheduled for tomorrow", time: "3 hours ago", isNew: false },
]

export default function NavbarButtons({ isChatOpen, toggleChat }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const newNotificationsCount = notifications.filter(n => n.isNew).length

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Button
        variant="outline"
        onClick={toggleChat}
        className={`
          relative overflow-hidden transition-all duration-300 ease-in-out
          px-4 py-2 font-medium text-sm rounded-full
          ${isChatOpen
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-transparent text-gray-700 border-none hover:bg-green-50'}
        `}
      >
        <SquarePen className="h-5 w-5 mr-2 inline-block" />
        Fråga Ledge
        <span className="sr-only">Öppna AI-chatt</span>
      </Button>
      <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`
        relative transition-all duration-300 ease-in-out
        ${isNotificationsOpen ? 'bg-white' : 'bg-transparent'}
      `}
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Visa notiser</span>
            {newNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[0.5rem] font-bold">
                {newNotificationsCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end" alignOffset={-40}>
          <div className="grid gap-4">
            <h3 className="font-medium leading-none">Notiser</h3>
            <div className="grid gap-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-4 p-2 hover:bg-gray-100">
                  <Bell className={`mt-1 h-5 w-5 ${notification.isNew ? 'text-blue-500' : 'text-gray-500'}`} />
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