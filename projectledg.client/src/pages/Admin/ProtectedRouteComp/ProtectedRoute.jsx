import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const token = Cookies.get('JWTToken');

    // Redirect if no token is present
    if (!token) {
        return <Navigate to="/admin-login" />;
    }

    const [jwtDecode, setJwtDecode] = useState(null);

    useEffect(() => {
        // Dynamically import jwt-decode
        const loadJwtDecode = async () => {
            try {
                const module = await import('jwt-decode');
                setJwtDecode(() => module.jwtDecode); // Set jwtDecode directly if available
            } catch (error) {
                console.error('Failed to load jwt-decode:', error);
            }
        };

        loadJwtDecode();
    }, []);

    // Return loading state if jwtDecode hasn't loaded
    if (!jwtDecode) {
        return <div>Loading...</div>;
    }

    // Decode and verify token
    try {
        const decodedToken = jwtDecode ? jwtDecode(token) : null;
        if (!decodedToken) throw new Error("Failed to decode token.");

        const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        // Check if user's role is within the required roles
        if (requiredRoles && !requiredRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" />;
        }

        return children;
    } catch (error) {
        console.error('Invalid token:', error);
        return <Navigate to="/admin-login" />;
    }
};

export default ProtectedRoute;
