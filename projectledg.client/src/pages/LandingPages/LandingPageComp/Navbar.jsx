import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Custom hook to check if we're in a Router context
function useIsInRouterContext() {
  const location = useLocation();
  return location !== null;
}

export default function Navbar() {
  const isInRouterContext = useIsInRouterContext();

  return (
    <div className="w-full flex justify-center p-4 bg-white">
      <nav className="text-white flex items-center justify-between w-full max-w-6xl">
        <div className="flex-shrink-0">
          {/* Placeholder for logo */}
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>
        
        <div className="hidden md:block bg-zinc-800/80 backdrop-blur-sm rounded-full px-2 py-1 w-1/2">
          <div className="flex justify-around space-x-4">
            <NavItem to="/why" isInRouterContext={isInRouterContext}>Varför Ledge?</NavItem>
            <NavItem to="/features" isInRouterContext={isInRouterContext}>Tjänster</NavItem>
            <NavItem to="/pricing" isInRouterContext={isInRouterContext}>Priser</NavItem>
            <NavItem to="/contact" isInRouterContext={isInRouterContext}>Kontakt</NavItem>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          
          <Button 
            variant="solid" 
            className=" hidden md:inline-flex text-black hover:bg-zinc-800 hover:text-zinc-200 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Logga in
          </Button>
          <Button 
            variant="solid" 
            className=" hidden md:inline-flex text-black hover:bg-zinc-800 hover:text-zinc-200 transition-all duration-300 ease-in-out transform hover:scale-105"
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
  )
}

function NavItem({ to, children, isInRouterContext }) {
  if (isInRouterContext) {
    return (
      <Link 
        to={to} 
        className="text-gray-300 hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-zinc-700"
      >
        {children}
      </Link>
    )
  } else {
    return (
      <a 
        href={to} 
        className="text-gray-300 hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-zinc-700"
      >
        {children}
      </a>
    )
  }
}