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

    <div className=" w-full flex justify-center fixed z-50">

      <div
        className={`w-[95%] flex justify-between py-1  px-7 sm:px-10  mt-2 bg-white rounded-full 
          ${shadow ? "shadow-md transition-all duration-700 ease-in-out bg-opacity-40 backdrop-blur-lg " : "transition-all duration-700 ease-in-out bg-opacity-80"} z-50`}
      >
        <nav className="text-black flex justify-between items-center w-full">

          {/* Logo Section */}
          <div className="flex flex-shrink-0 w-1/4 items-center justify-start">
            <Link to="/" className="block w-8 h-8 mr-2 ">
              <svg
                width="100%" height="100%" viewBox="0 0 150 150" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <g id="Group 1">

                  <rect id="Rectangle 1" width="150" height="150" rx="40" className="fill-green-500" />


                  <rect id="TopLeft" x="37" y="36" width="34" height="42" className="fill-white" />
                  <rect id="TopRight" x="79" y="36" width="34" height="26" className="fill-white" />
                  <rect id="BottomLeft" x="37" y="86" width="34" height="26" className="fill-white" />
                  <rect id="BottomRight" x="79" y="70" width="34" height="42" className="fill-white" />
                </g>
              </svg>

            </Link>
            <p className={`text-xl font-semibold transition-opacity duration-500 ease-in-out hidden sm:block ${shadow ? "opacity-0" : "opacity-100"}`}>Ledge</p>
          </div>

          {/* Navigation Items Section */}
          <div className="px-2 py-2 hidden sm:block">
            <div className=" text-black flex">
              <NavItem to="/why" className="mx-4">Varför Ledge?</NavItem>
              <NavItem to="/features" className="mx-4 ">Tjänster</NavItem>
              <NavItem to="/pricing" className="mx-4">Priser</NavItem>
              <NavItem to="/contact" className="mx-4">Kontakt</NavItem>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex items-center space-x-4 w-1/4 justify-end">
            <div className="hidden sm:block">
              <NavItem to="/login" className="text-gray-400">Logga in</NavItem>
            </div>
            <Button
              variant="solid"
              className="hidden md:inline-flex text-white text-lg font-normal bg-zinc-800  hover:bg-green-500 transition-all duration-300 ease-in-out"
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

      </div>
      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4">
          <div className="flex flex-col space-y-2">
            <NavItem to="/why">Varför Ledge?</NavItem>
            <NavItem to="/features" className="hidden sm:block">Tjänster</NavItem>
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