import { useState } from "react";
import { useParams, Link, Outlet, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ChatWindow from "./ChatWindow"; // Ensure this component exists and is imported
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
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Hem", path: "", position: "top" },
  { icon: Activity, label: "Finasiell rapport", path: "/financial-reports", position: "top" },
  { icon: BookCheck, label: "Bokför", path: "/book", position: "top" },
  { icon: BookDown, label: "Årsredovisning", path: "/financial-statement", position: "top" },
  { icon: Settings, label: "Inställningar", path: "/settings", position: "bottom" },
  { icon: HelpCircle, label: "Hjälp", path: "/", position: "bottom" },
  { icon: LogOut, label: "Logga ut", path: "/", position: "bottom" },
];

const NavItem = ({ icon: Icon, label, path }) => {
  const { companyId } = useParams(); // Get companyId from the route params
  const fullPath = `/dashboard/${companyId}${path}`;

  return (
    <Link to={fullPath} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const NavItemSmall = ({ icon: Icon, path }) => {
  const { companyId } = useParams(); // Get companyId from the route params
  const fullPath = `/dashboard/${companyId}${path}`;

  return (
    <Link to={fullPath} className="flex items-center justify-around space-x-2 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
      <Icon className="h-6 w-6" />
    </Link>
  );
};

const Sidebar = () => (
  <div className="hidden md:flex pb-12 bg-yellow/60 bg-opacity-80 w-60 h-full flex-col border-r bg-gradient-to-r from-gray-200 to-gray-100/50">
    <div className="flex-grow space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {navItems.filter(item => item.position === "top").map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-auto px-3 py-2 border-t">
      <div className="space-y-1">
        {navItems.filter(item => item.position === "bottom").map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </div>
    </div>
  </div>
);

const SidebarSmall = () => (
  <div className="hidden md:flex pb-12 bg-yellow/60 bg-opacity-80 w-20 h-full flex-col border-r bg-gradient-to-r from-gray-200 to-gray-100/50">
    <div className="flex-grow space-y-4 py-4">
      <div className="px-3 py-2 ">
        <div className="space-y-1 flex flex-col justify-around h-[30vh]">
          {navItems.filter(item => item.position === "top").map((item, index) => (
            <NavItemSmall key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-auto px-3 py-2 border-t">
      <div className="space-y-1 flex flex-col justify-around h-[20vh]">
        {navItems.filter(item => item.position === "bottom").map((item, index) => (
          <NavItemSmall key={index} {...item} />
        ))}
      </div>
    </div>
  </div>
);

const MobileNav = ({ navItems }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="md:hidden bg-transparent border-0">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-60 p-0">
      <div className="flex flex-col h-full py-4">
        <div className="flex-grow space-y-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {navItems.filter(item => item.position === "top").map((item, index) => (
                <NavItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto px-3 py-2 border-t">
          <div className="space-y-1">
            {navItems.filter(item => item.position === "bottom").map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default function DashboardLayout() {
  const { companyId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden shadow-lg">
      {/* Sidebar */}
      <div>
        {isChatOpen ? <SidebarSmall /> : <Sidebar />}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-auto h-screen bg-gradient-to-bl from-blue-700/40 to-gray-200">
          <div className={`max-w-7xl sm:px-6 md:px-8 w-full ${isChatOpen ? 'mx-0' : 'mx-auto'}`}>

            {/* Navbar */}
            <header className="fixed top-0 z-10 w-full left-0 md:left-60 right-0 md:w-[calc(100%-15rem)]">
              <div className="max-w-7xl mx-auto sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-16 bg-gradient-to-t from-white/60 to-white/30 backdrop-blur-lg rounded-b-[1.5rem] px-[1rem]">
                  <div className="flex items-center">

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                      <MobileNav navItems={navItems} />
                    </div>
                    <h1 className="text-l pl-4 sm:pl-6 pr-6 font-bold">Ditt företag här</h1>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <Button variant="ghost" size="icon" onClick={toggleChat} className={`transition-colors duration-200 ${isChatOpen ? 'bg-white' : ''}`}>
                      <MessageSquarePlus className="h-5 w-5" />
                      <span className="sr-only">Ask Ledge</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-5 w-5" />
                      <span className="sr-only">Invite Client</span>
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Chart Content Box */}
            <div className="mt-24 mb-8 flex flex-row">
              <div className={`chart-content-box rounded-[1.5rem] bg-white/60 bg-opacity-80 shadow-lg p-4 md:p-6 lg:p-8 ${isChatOpen ? 'w-[60vw]' : 'w-full'}`}>
                <Outlet context={{ isChatOpen }} />
              </div>

              {/* Conditionally render ChatWindow */}
              {isChatOpen && <ChatWindow onClose={toggleChat} />}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
