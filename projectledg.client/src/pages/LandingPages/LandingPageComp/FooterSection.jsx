import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const FooterSection = ({ title, links }) => (
  <div className="flex flex-col space-y-2">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {links.map((link, index) => (
      <a
        key={index}
        href="#"
        className="text-black hover:text-gray-300 transition-colors duration-300 text-lg font-normal"
        onClick={(e) => e.preventDefault()}
      >
        {link}
      </a>
    ))}
  </div>
)

const SocialIcon = ({ Icon }) => (
  <a
    href="#"
    className="text-black hover:text-gray-300 transition-colors duration-300"
    onClick={(e) => e.preventDefault()}
  >
    <Icon size={24} />
  </a>
)

export default function Component() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    
    
  ]

  const socialLinks = [Facebook, Twitter, Instagram, Linkedin]

  return (
    <div className="flex flex-col">
     

      
      <footer className="bg-white bg-opacity-20 backdrop-blur-lg w-full py-8 px-4 md:px-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-full mr-2"></div>
                <span className="text-xl font-bold text-black">Ledge</span>
              </div>
              <p className="mt-2 text-sm text-black">
                Ledge hjälper företag att växa och nå sin fulla potential.
              </p>
            </div>

            {/* Footer sections */}
            {footerSections.map((section, index) => (
              <FooterSection key={index} {...section} />
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-black">
              © {currentYear} Ledge AB. Alla rättigheter förbehållna.
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  )
}