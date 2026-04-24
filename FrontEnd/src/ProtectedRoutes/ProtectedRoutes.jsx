import React, { Children, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoutes({ children }) {
    const { user, loading } = useContext(AppContext);

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
