import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shadow, setShadow] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleScroll = () => {
    const isScrolled = window.scrollY > 0;
    setShadow(isScrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full flex justify-between py-3 px-10 sticky top-0 bg-white bg-opacity-20 backdrop-blur-lg 
      ${shadow ? "shadow-md transition-shadow duration-300 ease-in-out" : "transition-shadow duration-300 ease-in-out"} z-50`}
    >
      <nav className="text-black flex items-center justify-between w-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 w-1/4 flex justify-start">
          <div className="w-8 h-8 bg-black rounded-full">
            <Link to="/" className="w-full h-full block"></Link>
          </div>
        </div>

        {/* Navigation Items Section */}
        <div className=" md:block rounded-full px-2 py-1 flex-grow flex justify-center">
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
            className="hidden md:inline-flex text-white text-lg font-normal bg-zinc-800 hover:text-black hover:bg-green-500 transition-all duration-300 ease-in-out"
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

function NavItem({ to, children, className = "" }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const isAnchorLink = to.startsWith('#');

  const baseClasses = "relative text-black hover:text-gray-300 px-2 py-1 rounded-full text-lg font-normal transition-colors duration-300";
  const activeClasses = "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-green-500 before:transition-all before:duration-300 before:ease-in-out";

  if (isAnchorLink) {
    return (
      <a
        href={to}
        className={`${baseClasses} ${className}`}
        onClick={(e) => {
          e.preventDefault();
          const element = document.querySelector(to);
          if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${isActive ? activeClasses : ''} ${className}`}
    >
      {children}
    </Link>
  );
}