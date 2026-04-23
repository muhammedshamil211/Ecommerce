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
import ProductDetails from './pages/ProductDetails/ProductDetails'
import WishList from './pages/WishList/WishList'
import EditProfile from './pages/EditProfile/EditProfile'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import MyOrders from './pages/MyOrders/MyOrders'
import OrderDetails from './pages/OrderDetails/OrderDetails'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import { Toaster } from 'react-hot-toast';
import HelpCenter from './pages/HelpCenter/HelpCenter'
import SubmitRequest from './pages/SubmitRequest/SubmitRequest'

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
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path='/updateUser' element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>}></Route>
          <Route path="/addItems" element={<ProtectedRoutes><AddItems /></ProtectedRoutes>} />
          <Route path='/profile' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path='editItems/:id' element={<ProtectedRoutes><AddItems /></ProtectedRoutes>} />
          <Route path='/product/:category' element={<Category />}></Route>
          <Route path='/productDetails/:id' element={<ProductDetails />}></Route>
          <Route path='/product/wishlist' element={<ProtectedRoutes><WishList /></ProtectedRoutes>}></Route>
          <Route path='/cart' element={<ProtectedRoutes><Cart /></ProtectedRoutes>} />
          <Route path='/checkout' element={<ProtectedRoutes><Checkout /></ProtectedRoutes>} />
          <Route path='/order-success' element={<ProtectedRoutes><OrderSuccess /></ProtectedRoutes>} />
          <Route path='/my-orders' element={<ProtectedRoutes><MyOrders /></ProtectedRoutes>} />
          <Route path='/my-orders/:id' element={<ProtectedRoutes><OrderDetails /></ProtectedRoutes>} />
          <Route path='/helpCenter' element={<HelpCenter/>}></Route>
          <Route path='/submitRequest' element={<SubmitRequest/>}/>
        </Route>
      </Routes>
    </>
  )
}
