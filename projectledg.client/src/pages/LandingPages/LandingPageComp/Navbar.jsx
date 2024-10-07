import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
<div className="w-full flex justify-between py-3 px-10 bg-white">
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
      <NavItem to="/login" className="text-gray-400">Logga in</NavItem>
      <Button
        variant="solid"
        className="hidden md:inline-flex text-white text-lg font-normal bg-zinc-800 hover:text-zinc-200 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Kom igång
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-black hover:text-gray-300"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </div>
  </nav>
</div>

  
  );
}

function NavItem({ to, children, color, padding }) {
  return (
    <Link
      to={to}
      className={`text-black hover:text-gray-300 px-2 py-1 rounded-full text-lg font-normal transition-colors  duration-300 ${color} ${padding}`}

    >
      {children}
    </Link>
  );
}
