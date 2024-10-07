import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

// Main SignUp component
export default function SignUpPage() {
  // State to store the email input
  const [email, setEmail] = useState('')
  
  // Hook to programmatically navigate
  const navigate = useNavigate()

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Navigate to the next page, passing email as state
    navigate('/company-create', { state: { email } })
  }

  // Array of features for the plan
  const features = [
    'Lägg upp obegränsat med faktorur',
    'Översikt på din ekonomi',
    'Årsredovisning',
    'Balansrapport & Resultatrapport',
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-200">
      {/* Left side with logo and features */}
      <div className="hidden bg-slate-300 lg:flex lg:w-1/3 p-8 lg:p-12 flex-col justify-between">
        <div className='pt-40 pl-11'>
          {/* Logo placeholder */}
          <div className="w-10 h-10 bg-gray-800 rounded-lg mb-8"></div>
          <div className="mb-8">
            
            <h2 className="text-2xl font-bold mb-4">Plan inkluderar</h2>
            {/* Feature list */}
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side with sign-up form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4 lg:p-0 min-h-screen">
      <Card className="w-full max-w-md p-4 sm:p-8 lg:p-12">
        <div className="max-w-md mx-auto w-full">
          {/* Header with title and sign-in link */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Skapa Konto</h1>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              Har redan konto?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Logga in
              </a>
            </p>
          </div>
          
          {/* Social sign-up options */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Logga in med</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
          
          {/* Email sign-up form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Eller fortsätt med email adress</h2>
              <Input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Fortsätt</Button>
          </form>
          
          {/* reCAPTCHA notice */}
          <p className="text-xs text-gray-500 mt-4">
            This site is protected by reCAPTCHA and the Google Privacy Policy.
          </p>
        </div>
      </Card>     
      </div>
    </div>
  )
}