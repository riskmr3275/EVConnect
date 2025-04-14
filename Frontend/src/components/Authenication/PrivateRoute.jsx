import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
 

const PrivateRoute = ({ children }) => {
    const [redirect, setRedirect] = useState(false);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            toast.error("Login in first!👇", {
                duration: 4000, // Set duration in milliseconds
            });
            setTimeout(() => {
                setRedirect(true);
            }, 2000); // Adjust this delay as needed
        }
    }, [token]);

    if (token) {
        return children;
    } else if (redirect) {
        return <Navigate to="/login" replace />;
    } else {
        return null; // Return null or a loader while the toast is shown
    }
};

export default PrivateRoute;