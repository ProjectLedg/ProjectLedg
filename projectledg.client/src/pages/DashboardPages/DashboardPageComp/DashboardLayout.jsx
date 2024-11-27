import { useState, useEffect } from "react";
import { useParams, Link, Outlet, useOutletContext, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarButtons from "./NavbarButtons";
import ChatService from "@/services/ChatService";
import { axiosConfig } from '/axiosconfig'
import UserDropdown from "./UserDropdown";
import { motion, AnimatePresence } from "framer-motion"
import Cookies from "js-cookie";
import {
  Home,
  Menu,
  Activity,
  BookCheck,
  Settings,
  HelpCircle,
  BookDown,
  LogOut,
  FileText,
} from "lucide-react";

import {
  TooltipShad,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const handleLogout = (path) => (e) => {
  e.preventDefault();
  Cookies.remove('JWTToken');
  window.location.href = path;

  if (typeof window !== "undefined") {
    localStorage.setItem("vite-ui-theme", "light");
    document.documentElement.classList.remove("dark");
  }
};
const navItems = [
  { icon: Home, label: "Hem", path: "", position: "top" },
  { icon: Activity, label: "Finasiell rapport", path: "/financial-reports", position: "top" },
  { icon: BookCheck, label: "Bokför", path: "/book", position: "top" },
  { icon: BookDown, label: "Årsredovisning", path: "/annual-report", position: "top" },
  { icon: FileText, label: "Fakturering", path: "/invoicing", position: "top" },
  { icon: Settings, label: "Inställningar", path: "/settings", position: "bottom" },
  { icon: HelpCircle, label: "Hjälp", path: "/help", position: "bottom" },
  { icon: LogOut, label: "Logga ut", path: "/", position: "bottom", onClick: handleLogout("/") },
];



const NavItem = ({ icon: Icon, label, path, onClick }) => {
  const { companyId } = useParams();
  const location = useLocation();
  const fullPath = `/dashboard/${companyId}${path}`;

  const isSelected = location.pathname === fullPath;

  const baseStyle = "flex items-center space-x-2 px-3 py-4  transition-colors duration-500";
  const selectedStyle = "font-bold relative bg-accent dark:bg-darkSurface";
  const hoverStyle = "hover:bg-accent hover:dark:bg-darkSurface hover:text-accent-foreground";

  const handleClick = (e) => {
    if (onClick) onClick(e);
    else setTimeout(() => { }, 300); // Delay for other nav actions
  };

  const barStyle = {
    content: "''",
    position: "absolute",
    top: "0",
    right: "0",
    height: "100%",
    width: "4px",
    backgroundColor: "#22c55e",
    borderRadius: "9999px",
  };

  const barVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "100%" },
    exit: { opacity: 0, height: 0 },
  };



  return (
    <Link
      to={fullPath}
      className={`mb-4 ${baseStyle} ${isSelected ? selectedStyle : hoverStyle} dark:border-darkBorder`}
      style={{ marginTop: 0, ...(isSelected ? { position: "relative" } : {}) }}
      onClick={handleClick}
    >
      <Icon className="h-5 w-5 dark:text-gray-300" strokeWidth={isSelected ? 2 : 1} />
      <span className="dark:text-white">{label}</span>
      {isSelected && (
        <motion.span
          style={barStyle}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};





const NavItemSmall = ({ icon: Icon, path, tooltipText, onClick }) => {
  const { companyId } = useParams();
  const location = useLocation();
  const fullPath = `/dashboard/${companyId}${path}`;

  const isSelected = location.pathname === fullPath;

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  const baseStyle = "flex items-center justify-around space-x-2 px-3 py-4 rounded-lg transition-colors duration-500";
  const selectedStyle = "font-bold bg-accent text-accent-foreground dark:bg-darkSurface";
  const hoverStyle = "hover:bg-accent hover:text-accent-foreground hover:dark:bg-darkSurface";

  const barStyle = {
    content: "''",
    position: "absolute",
    top: "0",
    right: "0",
    height: "100%",
    width: "4px",
    backgroundColor: "#22c55e",
    borderRadius: "9999px",
  };

  const barVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "100%" },
    exit: { opacity: 0, height: 0 },
  };

  return (
    <Link
      to={fullPath}
      onClick={handleClick}
      className={`mb-4 ${baseStyle} ${isSelected ? selectedStyle : hoverStyle}`}
      style={{ marginTop: 0, ...(isSelected ? { position: "relative" } : {}) }}
    >

      <TooltipProvider>
        <TooltipShad>
          <TooltipTrigger>
            <Icon className="h-6 w-6" />
          </TooltipTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </TooltipShad>
      </TooltipProvider>

      {isSelected && (
        <motion.span
          style={barStyle}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};







const Sidebar = ({ isChatOpen }) => (
  <motion.div
    initial={{ width: isChatOpen ? '5rem' : '15rem' }}
    animate={{ width: isChatOpen ? '5rem' : '15rem' }}
    transition={{ duration: 0.6 }}
    className="hidden md:flex pb-12 h-full flex-col dark:bg-darkBackground "
  >

    <div className="flex-grow space-y-4 py-4 ">
      <div className="py-2 h-full ">
        <div className={`h-full ${isChatOpen ? 'flex flex-col h-[30vh]' : ''}`}>

          <UserDropdown

            isChatOpen={isChatOpen}
            isNavOpen={true}
          />

          {navItems.filter(item => item.position === "top").map((item, index) => (
            !isChatOpen ? <NavItem key={index} {...item} /> : <NavItemSmall key={index} {...item} tooltipText={item.tooltipText} />
          ))}

        </div>
      </div>
    </div>
    <div className="mt-auto border-t dark:border-darkBorder">
      <div className={` ${isChatOpen ? 'flex flex-col justify-around h-[20vh]' : ''}`}>
        {navItems.filter(item => item.position === "bottom").map((item, index) => (
          !isChatOpen ? <NavItem key={index} {...item} /> : <NavItemSmall key={index} {...item} tooltipText={item.tooltipText} onClick={item.onClick} />
        ))}
      </div>
    </div>
  </motion.div>
);


const MobileNav = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden bg-transparent border-0"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <div className="flex flex-col h-full py-4 dark:bg-darkBackground">
          <div className="flex-grow">
            {/* User Dropdown */}
            <UserDropdown isNavOpen={isOpen} />

            {/* Top Nav Items */}
            <div>
              {navItems
                .filter((item) => item.position === "top")
                .map((item, index) => (
                  <NavItem
                    key={index}
                    {...item}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e); // Call logout or other click handlers
                      handleClose(); // Close the mobile menu
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Bottom Nav Items */}
          <div className="mt-auto border-t dark:border-darkBorder">
            <div>
              {navItems
                .filter((item) => item.position === "bottom")
                .map((item, index) => (
                  <NavItem
                    key={index}
                    {...item}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e); // Trigger logout here
                      handleClose(); // Close the mobile menu
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};



export default function DashboardLayout() {
  const { companyId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        console.log("Fetching user's first name...");
        const response = await axiosConfig.get('/User/getUser');
        setUserName(response.data.firstName);
        console.log(response.data.firstName);
      } catch (error) {
        console.error("Error fetching user's first name:", error);
      }
    };

    fetchUserName();
  }, []);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get(`/company/${companyId}`);
      setCompanyData(response.data);
    } catch (error) {
      console.error("Failed to fetch company data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [companyId]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Is this needed? All content has loaders and nav doesn't need to load. Keeping for now if needed later
  // if (isLoading) {
  //   return <div>Loading...</div>; // Or a more sophisticated loading component
  // }
  console.log("Parent Component userName!!!!!!!!:", userName);

  return (

    <div className="flex h-screen overflow-hidden shadow-lg">
      {/* Sidebar */}
      {!isMobile && <Sidebar isChatOpen={isChatOpen} />}

      {/* Main Content */}
      <div className="MAIN CONTENT flex flex-col flex-1 overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex-1 overflow-auto h-screen bg-gradient-to-bl from-blue-700/40 to-gray-200 dark:bg-dark-gradient ">
          <div className="CONTAINER ALL flex flex-col max-h-screen sm:px-6 md:pl-8 md:pr-0  ">

            {/* Navbar */}
            <header className={`NAVBAR fixed top-0 z-20 w-full left-0 md:left-60 right-0 md:w-[calc(100%-15rem)]  ${isChatOpen && isMobile ? 'hidden' : ''}`}>
              <div className="mx-auto sm:px-6 md:px-8 ">
                <div className="flex items-center justify-between h-16 bg-gradient-to-t from-white/60 to-white/30 backdrop-blur-lg rounded-b-[1.5rem] px-[1rem] dark:bg-darkBackground dark:bg-none">
                  <div className="flex items-center">
                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                      <MobileNav navItems={navItems} />
                    </div>
                    <h1 className="text-lg pl-4 sm:pl-6 pr-6 font-bold hidden sm:block">{companyData ? companyData.companyName : 'Company Name'}</h1>
                  </div>
                  <div className="flex items-center md:mr-[3rem] sm:mr-[2rem] space-x-2 sm:space-x-4 ">
                    <NavbarButtons isChatOpen={isChatOpen} toggleChat={toggleChat} />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content or Chat Window Mobile */}
            <div className="flex flex-row m-0 lg:mr-8 md:mr-8 sm:mr-0 overflow-y-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} >
              {isMobile && isChatOpen ? (
                // Render ChatWindowMobile on mobile view only
                <ChatService onClose={toggleChat} userName={userName} mobile />
              ) : (
                <div className="mt-24 max-h-screen items-start flex flex-row justify-between w-full dark:from-gray-700 dark:to-gray-900">
                  <motion.div
                    className="chart-content-box rounded-[1.5rem] bg-white/60 bg-opacity-80 shadow-lg p-4 md:p-6 lg:p-8 mb-8 dark:bg-darkBackground"
                    animate={{
                      width: isChatOpen ? '67%' : '100%',
                    }}
                    initial={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <Outlet context={{ isChatOpen }} />
                  </motion.div>

                  <AnimatePresence>
                    {isChatOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: 1000 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 1000 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0 }}
                        className="inherit w-[30vw] fixed right-0"
                      >
                          <ChatService onClose={toggleChat} userName={userName} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}