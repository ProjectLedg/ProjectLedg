import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const token = Cookies.get('JWTToken');

    if (!token) {
        return <Navigate to="/admin-login" />;
    }

    // Declare state to handle dynamic import of jwt-decode
    const [jwt_decode, setJwtDecode] = useState(null);

    useEffect(() => {
        const loadJwtDecode = async () => {
            const module = await import('jwt-decode');
            setJwtDecode(() => module.default || module); // Handle default export or named export
        };

        loadJwtDecode();
    }, []);

    if (!jwt_decode) {
        return null; // or a loading spinner if needed
    }

    try {
        const decodedToken = jwt_decode(token);
        const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (requiredRoles && !requiredRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" />;
        }

        return children;
    } catch (error) {
        console.error('Invalid token', error);
        return <Navigate to="/admin-login" />;
    }
};

export default ProtectedRoute;
