import React, { useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout/Layout'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import AuthPage from './pages/AuthPage/AuthPage'
import AddItems from './pages/AddItems/AddItems'
import ProtectedRoutes from './ProtectedRoutes/ProtectedRoutes'
import Profile from './pages/Profile/Profile'
import { AppContext } from './context/AppContext'
import Category from './pages/Category/Category'

export default function App() {
  const { setUser, setLoading } = useContext(AppContext);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/addItems" element={<ProtectedRoutes><AddItems /></ProtectedRoutes>} />
        <Route path='/profile' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
        <Route path='editItems/:id' element={<ProtectedRoutes><AddItems/></ProtectedRoutes>}/>
        <Route path='/product/:category' element={<Category/>}></Route>
      </Route>
    </Routes>
  )
}
