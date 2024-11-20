import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LedgeIcon from "@/assets/LedgeIcon.svg"
import Cookie from 'js-cookie';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault()
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            //send login request
            const response = await axios.post('https://projectledg.azurewebsites.net/api/User/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            Cookie.set("JWTTolkien", response.data.token)

            Cookie.set("UserRole", response.data.roles[0])
            if (response.data.message === 'Login successful') {
                navigate('/company-select')
            }
            else {
                alert('Login failed. Please check your credentials.');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || "An error occured during login. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        try {
            //Redirect to backend endpoint for Google sign-in
            window.location.href = "https://projectledg.azurewebsites.net/api/login-google";
        }
        catch (error) {
            console.error("Error during sign-in redirect:", error);
            // alert("An error occured while redirecting to Google login. Please try again.")
            alert("An error occured while redirecting to Google login. Please try again.")
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup')
    }

    const handleMicrosoftSignIn = () => {
        try {
            window.location.href = "https://projectledg.azurewebsites.net/api/login-microsoft"
        }
        catch (error) {
            console.error("Error during sign-in redirect:", error);
            // alert("An error occured while redirecting to Google login. Please try again.")
            alert("An error occured while redirecting to Microsoft login. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-300 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-white shadow-lg rounded-[1.5rem]">
                <CardHeader className="flex flex-col items-center space-y-4 pt-4 sm:pt-8">

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

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Logga in</h1>
                    {/* <p className="text-sm text-gray-600">Logga in med Google</p> */}
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                    <div className="flex flex-col space-y-2 ">
                        <Button
                            onClick={handleGoogleSignIn}
                            className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                                <title>Logga in med Google</title>
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
                            Fortsätt via Google
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
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-gray-500">Eller fortsätt med Email</span>
                        </div>
                    </div>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="password"
                                placeholder="Lösenord"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loggar in...
                                </>
                            ) : (
                                'Logga in'
                            )}
                        </Button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2 pt-0 px-4 sm:px-6">
                    <p className="text-xs text-gray-500 text-center">
                        This site is protected by reCAPTCHA and the Google Privacy Policy.
                    </p>
                    <p className="text-sm text-gray-600">
                        Har inget konto? <a href="#" className="text-blue-500 hover:underline" onClick={handleSignUpClick}>Skapa Konto</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}