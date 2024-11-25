import React, { useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Check, Loader, Mail, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (userDetails.email !== userDetails.emailConfirmed) {
      setError("Epost matchar inte");
      setIsLoading(false);
      return;
    }
    if (userDetails.password !== userDetails.passwordConfirmed) {
      setError("Lösenorden matchar inte.");
      setIsLoading(false);
      return;
    }
    if (userDetails.password.length < 8 || userDetails.password.length > 20) {
      setError("Lösenordet måste innehåll 8 tecken.");
      setIsLoading(false);
      return;
    }

    try {
      console.log(userDetails);
      const response = await axios.post('https://projectledgserver.azurewebsites.net/api/User/create', userDetails, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      setIsModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    try {
      //Redirect to backend endpoint for Google sign-in
      window.location.href = "https://projectledgserver.azurewebsites.net/api/login-google";
    }
    catch (error) {
      console.error("Error during sign-in redirect:", error);
      // alert("An error occured while redirecting to Google login. Please try again.")
      alert("An error occured while redirecting to Google login. Please try again.")
    }
  };

  const handleMicrosoftSignIn = () => {
    try {
      window.location.href = "https://projectledgserver.azurewebsites.net/api/login-microsoft"
    }
    catch (error) {
      console.error("Error during sign-in redirect:", error);
      // alert("An error occured while redirecting to Google login. Please try again.")
      alert("An error occured while redirecting to Microsoft login. Please try again.")
    }
  }

  const features = [
    'Lägg upp obegränsat med fakturor',
    'Översikt på din ekonomi',
    'Årsredovisning',
    'Balansrapport & Resultatrapport',
  ];

  return (
    <div className="flex justify-center lg:flex-row min-h-screen max-h-fit bg-slate-300">
      {/* <div className="hidden flex-1 overflow-auto bg-gradient-to-b from-blue-700/40 to-gray-200 lg:flex lg:w-1/3 p-8 lg:p-12 flex-col justify-between">
        <div className='pt-40 pl-11'>
          <svg
            width="40" height="40" viewBox="0 0 150 150" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-8"
          >
            <g id="Group 1">
              
              <rect id="Rectangle 1" width="150" height="150" rx="40" className="fill-green-500" />

              
              <rect id="TopLeft" x="37" y="36" width="34" height="42" className="fill-white" />
              <rect id="TopRight" x="79" y="36" width="34" height="26" className="fill-white" />
              <rect id="BottomLeft" x="37" y="86" width="34" height="26" className="fill-white" />
              <rect id="BottomRight" x="79" y="70" width="34" height="42" className="fill-white" />
            </g>
          </svg>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Plan inkluderar</h2>
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
 */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4 lg:p-0 min-h-screen px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md rounded-[1.5rem] p-4 sm:p-8 lg:p-12 m-8">
          <CardHeader className="flex flex-col items-center space-y-4 sm:pt-4">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <g id="Group 1">
                {/* <!-- Outer Rounded Rectangle --> */}
                <rect id="Rectangle 1" width="150" height="150" rx="40" className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center" />

                {/* <!-- Inner Squares with Separate Tailwind Colors --> */}
                <rect id="TopLeft" x="37" y="36" width="34" height="42" className="fill-white" />
                <rect id="TopRight" x="79" y="36" width="34" height="26" className="fill-white" />
                <rect id="BottomLeft" x="37" y="86" width="34" height="26" className="fill-white" />
                <rect id="BottomRight" x="79" y="70" width="34" height="42" className="fill-white" />
              </g>
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Skapa Konto</h1>
          </CardHeader>
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline" className="w-full max-w-md flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <desc>Google G Logo</desc>
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  Fortsätt med Google
                </Button>
                <Button
                  onClick={handleMicrosoftSignIn}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="w-5 h-5 mr-2">
                    <title>Logga in med Microsoft</title>
                    <desc>Microsoft Logo</desc>
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  Fortsätt via Microsoft
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">Eller</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="email"
                      name="emailConfirmed"
                      placeholder="Bekräfta Email"
                      value={userDetails.emailConfirmed}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Lösenord"
                      value={userDetails.password}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="password"
                      name="passwordConfirmed"
                      placeholder="Bekräfta Lösenord"
                      value={userDetails.passwordConfirmed}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Förnamn"
                    value={userDetails.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Efternamn"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Skapar konto...
                  </>
                ) : (
                  'Fortsätt'
                )}
              </Button>
            </form>
          </div>
          <CardFooter className="flex flex-col items-center space-y-2 pt-0 px-4 sm:px-6">

            <p className="text-sm text-gray-500 pt-4 sm:mt-0">
              Har redan konto?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Logga in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Epost verifikation skickad</DialogTitle>
            <DialogDescription>
            En e-postverifiering har skickats till din e-post. Kontrollera din inkorg och följ instruktionerna för att slutföra din registrering.  
            </DialogDescription>
          </DialogHeader>
          <Link to="/login" className="inline-block">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:bg-green-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Logga in
            </Button>
          </Link>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SignUpPage