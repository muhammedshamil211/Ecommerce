import React, { Children, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoutes({ children }) {
    const { user, setUser, loading } = useContext(AppContext);
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);
    const location = useLocation();
    if (loading) {
        return <div>Loading.....</div>
    }
    if (!user) {
        return <Navigate
            to="/login"
            state={{ from: location.pathname }}
            replace
        />
    }
    return children;
}
