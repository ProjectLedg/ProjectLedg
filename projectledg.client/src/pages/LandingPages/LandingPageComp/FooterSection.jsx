import React from 'react'
import { Link, } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'





export default function Component() {
  const currentYear = new Date().getFullYear()


  return (
    <div className="flex flex-col">
     

      
      <footer className="px-5 bg-white bg-opacity-20 backdrop-blur-lg w-full py-8 md:px-10 border-t border-gray-200">
        <div className="w-full ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 mr-2">
                  <Link to="/" className="block w-8 h-8">
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
                </div>
                <span className="text-xl font-semibold text-black">Ledge</span>
              </div>
              <p className="mt-2 text-sm text-black">
                Ledge hjälper företag att växa och nå sin fulla potential.
              </p>
            </div>

            
          </div>
            
          
        </div>
        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-black">
              © {currentYear} Ledge AB. Alla rättigheter förbehållna.
            </div>
            
          </div>
      </footer>
      
    </div>
  )
}