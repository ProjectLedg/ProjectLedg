import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Mail, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            //send login request
            const response = await axios.post('https://localhost:7223/api/User/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.data.message === 'Login successful') {
                if (response.data.hasCompany === true) {
                    navigate('/company-select');
                } else if (response.data.hasCompany === false) {
                    navigate('/company-create');
                }
            }
            
            else {
                alert('Login failed. Please check your credentials.');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || "An error occured during login. Please try again.");
        }
    };

    const handleGoogleSignIn = () => {
        console.log('Sign in with Google')
        // Add your Google sign-in logic here
    }


    const handleSignUpClick = () => {
        navigate('/signup')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-300 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="flex flex-col items-center space-y-4 pt-6 sm:pt-8">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Logga in</h1>
                    <p className="text-sm text-gray-600">Logga in med Google</p>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button
                            onClick={handleGoogleSignIn}
                            className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                                <title>Logga in med Google</title>
                                <desc>Google G Logo</desc>
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"  /* Blue part */
                                ></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"  /* Green part */
                                ></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"  /* Yellow part */
                                ></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"  /* Red part */
                                ></path>
                            </svg>
                            Google
                        </Button>
                        
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
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
                        <Button type="submit" className="w-full">
                            Logga in
                        </Button>
                    </form>
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