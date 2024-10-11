import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Menu,
  MessageSquarePlus,
  UserPlus,
  Activity,
  BookCheck,
  Settings,
  HelpCircle,
  BookDown,
  LogOut,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Hem', path: '', position: 'top' },
  { icon: Activity, label: 'Finasiell rapport', path: '/financial-reports', position: 'top' },
  { icon: BookCheck, label: 'Bokför', path: '/book', position: 'top' },
  { icon: BookDown, label:'Årsredovisning', path:'/financial-statement', position:'top'},
  { icon: Settings, label: 'Inställningar', path: '/settings', position: 'bottom' },
  { icon: HelpCircle, label: 'Hjälp', path: '/', position: 'bottom' },
  { icon: LogOut, label: 'Logga ut', path: '/', position: 'bottom'},
]

const NavItem = ({ icon: Icon, label, path }) => {
    const { companyId } = useParams(); // Get companyId from the route params

    const fullPath = `/dashboard/${companyId}${path}`

    return (
      <Link to={fullPath} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    )
}

const Sidebar = ({ className }) => (
  <div className={cn("pb-12 bg-white/60 bg-opacity-80 w-60 flex flex-col h-full", className)}>
    <div className="flex-grow space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Meny
        </h2>
        <div className="space-y-1">
          {navItems.filter(item => item.position === 'top').map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-[30rem] px-3 py-2 border-t">
      <div className="space-y-1">
        {navItems.filter(item => item.position === 'bottom').map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
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
    <SheetContent side="left" className="w-60 p-0">
      <Sidebar className="w-full h-full" />
    </SheetContent>
  </Sheet>
)

export default function Component() {
  const { companyId } = useParams();
  useEffect(() => {
    // Use companyId to fetch data from your backend
    console.log("Selected Company ID:", companyId);
    // Make an API call to fetch the company data here
  }, [companyId]);

  return (
    <div className="flex h-screen overflow-hidden shadow-lg bg-gradient-to-bl from-neutral-700/40 to-gray-200">
      <Sidebar className="hidden border-r md:block" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:mx-40 bg-white/60 bg-opacity-80 rounded-b-[1.5rem] py-4">
          <div className="flex items-center">
            <MobileNav navItems={navItems} />
            <h1 className="text-l pl-4 sm:pl-6 pr-6 font-bold">Ditt företag här</h1> 
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
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
        <div className="h-full overflow-y-auto rounded-[1.5rem] bg-white/60 bg-opacity-80 mt-4 sm:mt-10 mx-4 sm:mx-6 md:mx-8 lg:mx-40 my-2 sm:my-5 shadow-lg p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}