import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the dropdown menu
  const [shadow, setShadow] = useState(false); // State to control the shadow effect
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle menu visibility
  };

  // Handle scroll events
  const handleScroll = () => {
    const isScrolled = window.scrollY > 0; // Check if scrolled
    setShadow(isScrolled); // Update shadow state
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, []);

  return (
    <div
      className={`w-full flex justify-between py-3 px-10 sticky top-0 bg-white bg-opacity-20 backdrop-blur-lg 
      ${shadow ? "shadow-md transition-shadow duration-300 ease-in-out" : "transition-shadow duration-300 ease-in-out"} z-10`}
    >
      <nav className="text-black flex items-center justify-between w-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 w-1/4 flex justify-start">
          {/* Placeholder for logo */}
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>

        {/* Navigation Items Section */}
        <div className="hidden md:block rounded-full px-2 py-1 flex-grow flex justify-center">
          <div className="flex justify-around text-black">
            <NavItem to="/why" className="mx-2">Varför Ledge?</NavItem>
            <NavItem to="/features" className="mx-2">Tjänster</NavItem>
            <NavItem to="/pricing" className="mx-2">Priser</NavItem>
            <NavItem to="/contact" className="mx-2">Kontakt</NavItem>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <div className="hidden md:block">
            <NavItem to="/login" className="text-gray-400">Logga in</NavItem>
          </div>
          
          <Button
            variant="solid"
            className="hidden md:inline-flex text-white text-lg font-normal bg-zinc-800 hover:text-black hover:bg-green-500 transition-all duration-300 ease-in-out "
            onClick={() => navigate("/signup")}
          >
            Kom igång
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-black"
            onClick={toggleMenu} 
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4">
          <div className="flex flex-col space-y-2">
            <NavItem to="/why">Varför Ledge?</NavItem>
            <NavItem to="/features">Tjänster</NavItem>
            <NavItem to="/pricing">Priser</NavItem>
            <NavItem to="/contact">Kontakt</NavItem>
            <NavItem to="/login" className="text-gray-400">Logga in</NavItem>
            <Button
              variant="solid"
              className="w-full text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              Kom igång
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ to, children, color, padding }) {
  return (
    <Link
      to={to}
      className={`text-black hover:text-gray-300 px-2 py-1 rounded-full text-lg font-normal transition-colors duration-300 ${color} ${padding}`}
    >
      {children}
    </Link>
  );
}
