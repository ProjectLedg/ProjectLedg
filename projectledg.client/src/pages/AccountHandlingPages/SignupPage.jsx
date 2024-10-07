import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const SignUpPage = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    emailConfirmed: "",
    password: "",
    passwordConfirmed: "",
    firstName: "",
    lastName: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userDetails.email !== userDetails.emailConfirmed) {
      setError("Emails do not match.");
      return;
    }
    if (userDetails.password !== userDetails.passwordConfirmed) {
      setError("Passwords do not match.");
      return;
    }
    if(userDetails.password.length < 8 || userDetails.password.length > 20) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      console.log(userDetails);
      const response = await axios.post('https://localhost:7223/api/User/create', userDetails, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate('/company-create', { state: { user: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup. Please try again.");
    }
  };

  const features = [
    'Lägg upp obegränsat med faktorur',
    'Översikt på din ekonomi',
    'Årsredovisning',
    'Balansrapport & Resultatrapport',
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-200">
      <div className="hidden bg-slate-300 lg:flex lg:w-1/3 p-8 lg:p-12 flex-col justify-between">
        <div className='pt-40 pl-11'>
          <div className="w-10 h-10 bg-gray-800 rounded-lg mb-8"></div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Plan inkluderar</h2>
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
      
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4 lg:p-0 min-h-screen">
        <Card className="w-full max-w-md p-4 sm:p-8 lg:p-12">
          <div className="max-w-md mx-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Skapa Konto</h1>
              <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                Har redan konto?{" "}
                <a href="/" className="text-blue-600 hover:underline">
                  Logga in
                </a>
              </p>
            </div>
            
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
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Eller fortsätt med email adress</h2>
                <div className="space-y-4">
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={userDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    type="email" 
                    name="emailConfirmed"
                    placeholder="Confirm Email" 
                    value={userDetails.emailConfirmed}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={userDetails.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    type="password" 
                    name="passwordConfirmed"
                    placeholder="Confirm Password" 
                    value={userDetails.passwordConfirmed}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    type="text" 
                    name="firstName"
                    placeholder="First Name" 
                    value={userDetails.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input 
                    type="text" 
                    name="lastName"
                    placeholder="Last Name" 
                    value={userDetails.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">Fortsätt</Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">
              This site is protected by reCAPTCHA and the Google Privacy Policy.
            </p>
          </div>
        </Card>     
      </div>
    </div>
  )
}

export default SignUpPage