import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Input } from "@/components/ui/input";   // Assuming you have an Input component
import { Mail, Lock, Loader2 } from 'lucide-react'; // Icons for better UX
import Cookies from 'js-cookie';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
          const response = await axios.post(
              'https://localhost:7223/api/Admin/admin-login', 
              { email, password },
              {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true,
              }
          );
  
          /* console.log("Login response:", response.data); */
  
          // Destructure token and roles from response
          const { token, roles } = response.data;
  
          if (token && roles && (roles.includes("Admin") || roles.includes("Manager"))) {
              // Optional: Store the token in a secure cookie for future requests
              Cookies.set('JWTToken', token, { secure: true, sameSite: 'strict' });
  
              // Navigate to the dashboard
              navigate('/admin/dashboard');
          } else {
              setError('Access denied. You do not have the required role.');
          }
      } catch (err) {
          setError(err.response?.data?.message || 'An error occurred. Please try again later.');
          console.error('Login error:', err);
      } finally {
          setIsLoading(false);
      }
  };
  
  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Admin Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative mt-4">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
