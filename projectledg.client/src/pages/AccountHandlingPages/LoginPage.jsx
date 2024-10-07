import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = (e) => {
        e.preventDefault()
        console.log('Sign in with:', email, password)
        // Add your sign-in logic here
    }

    const handleGoogleSignIn = () => {
        console.log('Sign in with Google')
        // Add your Google sign-in logic here
    }

    const handleAppleSignIn = () => {
        console.log('Sign in with Apple')
        // Add your Apple sign-in logic here
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign in</h1>
                    <p className="text-sm text-gray-600">Sign in with Open accounts</p>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button 
                            onClick={handleGoogleSignIn} 
                            className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                            </svg>
                            Google
                        </Button>
                        <Button 
                            onClick={handleAppleSignIn} 
                            className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.11 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                            </svg>
                            Apple ID
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with email address</span>
                        </div>
                    </div>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2 pt-0 px-4 sm:px-6">
                    <p className="text-xs text-gray-500 text-center">
                        This site is protected by reCAPTCHA and the Google Privacy Policy.
                    </p>
                    <p className="text-sm text-gray-600">
                        Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}