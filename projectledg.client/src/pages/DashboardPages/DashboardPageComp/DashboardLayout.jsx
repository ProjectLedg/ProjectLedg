import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Menu,
  Search,
  MessageSquarePlus,
  UserPlus,
  Activity,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Activity, label: 'Financial Reports', path: '/dashboard/financial-reports' }

  
]

const NavItem = ({ icon: Icon, label, path }) => (
  <Link to={path} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </Link>
)

const Sidebar = ({ className }) => (
  <div className={cn("pb-12 bg-white/60 bg-opacity-80 w-60", className)}>
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Menu
        </h2>
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const MobileNav = ({ navItems }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-60">
      <Sidebar className="w-full" />
    </SheetContent>
  </Sheet>
)

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden shadow-lg bg-gradient-to-bl from-neutral-700/40 to-gray-200">
      <Sidebar className="hidden border-r md:block" />
      <div className="flex  flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between mx-40 bg-white/60 bg-opacity-80 rounded-b-[1.5rem] px-6 py-4 ">
          <div className="flex items-center">
            <MobileNav navItems={navItems} />
            
            <h1 className="text-l pl-6 pr-6 font-bold">Your Company</h1> 
            
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-[200px] lg:w-[250px] rounded-full"
              />
            </div>
            <Button variant="ghost" size="icon">
              <MessageSquarePlus className="h-5 w-5" />
              <span className="sr-only">Ask Digits</span>
            </Button>
            <Button variant="ghost" size="icon">
              <UserPlus className="h-5 w-5" />
              <span className="sr-only">Invite Client</span>
            </Button>
          </div>
        </header>
        <div className="h-full overflow-y-auto rounded-[1.5rem] bg-white/60 bg-opacity-80 mt-10 bg-op mx-40 my-5 shadow-lg p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
      </div>
    </div>
  )
}