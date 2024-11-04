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


const navItems = [
  { icon: Home, label: "Hem", path: "", position: "top" },
  { icon: Activity, label: "Finasiell rapport", path: "/financial-reports", position: "top" },
  { icon: BookCheck, label: "Bokför", path: "/book", position: "top" },
  { icon: BookDown, label: "Årsredovisning", path: "/financial-statement", position: "top" },
  { icon: FileText, label: "Fakturering", path: "/invoicing", position: "top" },
  { icon: Settings, label: "Inställningar", path: "/settings", position: "bottom" },
  { icon: HelpCircle, label: "Hjälp", path: "/", position: "bottom" },
  { icon: LogOut, label: "Logga ut", path: "/", position: "bottom" },
];



const NavItem = ({ icon: Icon, label, path }) => {
  const { companyId } = useParams();
  const location = useLocation();
  const fullPath = `/dashboard/${companyId}${path}`;

  const isSelected = location.pathname === fullPath;

  const baseStyle = "flex items-center space-x-2 px-3 py-4 rounded-lg transition-colors duration-500";
  const selectedStyle = "font-bold relative bg-accent";
  const hoverStyle = "hover:bg-accent hover:text-accent-foreground";

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

  if (label === "Logga ut") {
    return handleLogout({ icon: Icon, label, path });
  }

  return (
    <Link
      to={fullPath}
      className={`mb-4 ${baseStyle} ${isSelected ? selectedStyle : hoverStyle}`}
      style={{ marginTop: 0, ...(isSelected ? { position: "relative" } : {}) }}
    >
      <Icon className="h-5 w-5" strokeWidth={isSelected ? 2 : 1} />
      <span>{label}</span>
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





const NavItemSmall = ({ icon: Icon, path }) => {
  const { companyId } = useParams();
  const location = useLocation();
  const fullPath = `/dashboard/${companyId}${path}`;

  const isSelected = location.pathname === fullPath;

  const baseStyle = "flex items-center justify-around space-x-2 px-3 py-4 rounded-lg transition-colors duration-500";
  const selectedStyle = "font-bold bg-accent text-accent-foreground";
  const hoverStyle = "hover:bg-accent hover:text-accent-foreground";

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
      className={`mb-4 ${baseStyle} ${isSelected ? selectedStyle : hoverStyle}`}
      style={{ marginTop: 0, ...(isSelected ? { position: "relative" } : {}) }}
    >
      <Icon className="h-6 w-6" />
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


const handleLogout = ({ icon: Icon, label, path }) => {
  const handleClick = (e) => {
    e.preventDefault();
    Cookies.remove('JWTToken');
    // Add any additional logout logic here
    window.location.href = path; // Redirect after logout
  };

  return (
    <a href={path} onClick={handleClick} className="flex items-center  space-x-2 px-3 py-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-500 ">
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
};


const Sidebar = ({ isChatOpen }) => (
  <motion.div
    initial={{ width: isChatOpen ? '5rem' : '15rem' }}
    animate={{ width: isChatOpen ? '5rem' : '15rem' }}
    transition={{ duration: 0.6 }}
    className="hidden md:flex pb-12 h-full flex-col"
  >

    <div className="flex-grow space-y-4 py-4">
      <div className="py-2 h-full">
        <div className={`h-full${isChatOpen ? 'flex flex-col justify-around h-[30vh]' : ''}`}>

          <UserDropdown
            user={{
              name: "John Doe",
              email: "john@example.com",
              avatarUrl: "https://example.com/avatar.jpg"
            }}
            companies={[
              { id: "1", name: "Company A" },
              { id: "2", name: "Company B" },
              { id: "3", name: "Company C" }
            ]}
            currentCompany={{ id: "1", name: "Company A" }}
            onCompanyChange={(company) => {
              // Handle company change here
              console.log("Switched to:", company.name);
            }}
            isChatOpen={isChatOpen}
            />

          {navItems.filter(item => item.position === "top").map((item, index) => (
            !isChatOpen ? <NavItem key={index} {...item} /> : <NavItemSmall key={index} {...item} />
          ))}

        </div>
      </div>
    </div>
    <div className="mt-auto border-t">
      <div className={` ${isChatOpen ? 'flex flex-col justify-around h-[20vh]' : ''}`}>
        {navItems.filter(item => item.position === "bottom").map((item, index) => (
          !isChatOpen ? <NavItem key={index} {...item}  /> : <NavItemSmall key={index} {...item} />
        ))}
      </div>
    </div>
  </motion.div>
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
  const [isMobile, setIsMobile] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get(`/Company/${companyId}`);
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


  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="flex h-screen overflow-hidden shadow-lg">
      {/* Sidebar */}
      {!isMobile && <Sidebar isChatOpen={isChatOpen} />}

      {/* Main Content */}
      <div className="MAIN CONTENT flex flex-col flex-1">
        <div className="flex-1 overflow-auto h-screen bg-gradient-to-bl from-blue-700/40 to-gray-200">
          <div className="CONTAINER ALL flex flex-col max-h-screen sm:pl-6 md:pl-8 ">

            {/* Navbar */}
            <header className={`NAVBAR fixed top-0 z-10 w-full left-0 md:left-60 right-0 md:w-[calc(100%-15rem)] ${isChatOpen && isMobile ? 'hidden' : ''}`}>
              <div className="mx-auto sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-16 bg-gradient-to-t from-white/60 to-white/30 backdrop-blur-lg rounded-b-[1.5rem] px-[1rem]">
                  <div className="flex items-center">
                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                      <MobileNav navItems={navItems} />
                    </div>
                    <h1 className="text-lg pl-4 sm:pl-6 pr-6 font-bold hidden sm:block">{companyData ? companyData.companyName : 'Company Name'}</h1>
                  </div>
                  <div className="flex items-center md:mr-[3rem] sm:mr-[2rem] space-x-2 sm:space-x-4">
                    <NavbarButtons isChatOpen={isChatOpen} toggleChat={toggleChat} />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content or Chat Window Mobile */}
            <div className="flex flex-row m-0 lg:mr-8 md:mr-8 sm:mr-0">
              {isMobile && isChatOpen ? (
                // Render ChatWindowMobile on mobile view only
                <ChatService onClose={toggleChat} mobile />
              ) : (
                <div className="CHATWINDOW mt-24 max-h-screen items-start flex flex-row justify-between w-full ">
                  <motion.div
                    className="chart-content-box rounded-[1.5rem] bg-white/60 bg-opacity-80 shadow-lg p-4 md:p-6 lg:p-8 mb-8"
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
                        <ChatService onClose={toggleChat} />
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