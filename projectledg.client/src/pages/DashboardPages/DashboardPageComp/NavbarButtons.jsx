import React, { useState, useEffect } from 'react'
import { axiosConfig } from '/axiosconfig'
import { Button } from "@/components/ui/button"
import { SquarePen, Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NavbarButtons({ isChatOpen, toggleChat }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Hämta notiser från API vid komponentens mount
 
    const fetchNotifications = async () => {
      try {
        const response = await axiosConfig.get('/User/notices/1') // Ändra URL till ditt API
        const fetchedNotifications = response.data.map(notification => ({
          id: notification.id,
          message: notification.title,
          contentmessage: notification.content,
          time: new Date(notification.createdAt).toLocaleString('sv-SE', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          
          isNew: !notification.isRead,
        }))
        setNotifications(fetchedNotifications)
      } catch (error) {
        console.error('Kunde inte hämta notiser:', error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchNotifications() // Hämta direkt vid mount
  
      const interval = setInterval(() => {
        fetchNotifications() // Hämta notiser var 1 minut
      }, 60000) // 60000ms = 1 minut
  
      return () => clearInterval(interval) // Rensa intervallet när komponenten unmountas
    }, [])


    fetchNotifications()


  const newNotificationsCount = notifications.filter(n => n.isNew).length

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 ">
      <Button
        variant="outline"
        onClick={toggleChat}
        className={`
        relative overflow-hidden transition-all duration-300 ease-in-out
        px-4 py-2 font-medium text-sm rounded-full dark:bg-transparent dark:text-white
        ${isChatOpen
            ? 'bg-green-500 text-white border-green-500 dark:bg-darkSurface dark:border-none'
            : 'bg-transparent text-gray-700 border-none hover:bg-green-50 dark:hover:bg-darkSurface'}
        `}
      >
        <SquarePen className="h-5 w-5 mr-2 inline-block" />
        <span className="hidden sm:block">Fråga Ledge</span>
        <span className="sr-only">Öppna AI-chatt</span>
      </Button>
      <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`
        relative transition-all duration-300 ease-in-out dark:hover:bg-darkSurface
        ${isNotificationsOpen ? 'bg-white dark:bg-darkSurface' : 'bg-transparent'}
      `}
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Visa notiser</span>
            {newNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[0.5rem] font-bold ">
                {newNotificationsCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 dark:bg-darkBackground dark:border-darkBorder" align="end" alignOffset={-40}>
          <div className="grid gap-4 ">
            <h3 className="font-medium leading-none">Notiser</h3>
            <div className="grid gap-2">

              {loading ? (
                <p>Laddar notiser...</p>
              ) : notifications.length === 0 ? (
                <p>Inga nya notiser.</p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 p-2 hover:bg-gray-100 hover:dark:bg-darkSurface ">
                    <Bell className={`mt-1 h-5 w-5 ${notification.isNew ? 'text-blue-500' : 'text-gray-500'}`} />
                    <div className="grid gap-1">
                      <p className="text-m font-medium leading-none">{notification.message}</p>
                      <p className="text-sm text-gray-500 leading-none mt-1">{notification.contentmessage}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
