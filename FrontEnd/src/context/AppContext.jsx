import React, { createContext, useEffect, useState, useCallback } from 'react'
import { refreshToken, logout as authLogout } from '../services/authApi'
import { allItems } from '../services/productApi'
import { getCart, addToCartAPI, updateCartItemAPI, removeFromCartAPI, clearCartAPI } from '../services/cartApi'
import { getWishList } from '../pages/WishList/api'


export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [allProduct, setAllProduct] = useState([])
  const [cart, setCart] = useState([])            // [{ product: {...}, qty }]
  const [cartOpen, setCartOpen] = useState(false) // controls CartDrawer

  // ── Derived cart values ──────────────────────────────────────────────────
  const cartCount = cart.length   // unique products only, NOT qty sum
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product?.offer || item.product?.price || 0
    return acc + price * item.qty
  }, 0)
  const wishlistCount = wishlist.length

  // ── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)

        const storedUser = user // Already synced from useState init

        if (storedUser) {
          
          // Attempt silent refresh to update the token, but don't force logout on failure
          // (iOS ITP or transient network issues might cause a false negative here)
          try {
            const res = await refreshToken()
            if (res.success) {
              const updatedUser = { ...storedUser, accessToken: res.accessToken }
              setUser(updatedUser)
              localStorage.setItem('user', JSON.stringify(updatedUser))
              fetchCartFromServer(updatedUser.accessToken)
              fetchWishlistFromServer(updatedUser.accessToken)
            }
          } catch (err) {
            console.warn("Silent bootstrap refresh failed:", err)
            // Still fetch cart/wishlist with existing token
            fetchCartFromServer(storedUser.accessToken)
            fetchWishlistFromServer(storedUser.accessToken)
          }
        }

        const productsRes = await allItems()
        if (productsRes.success) {
          setAllProduct(productsRes.products || [])
        }
      } catch (error) {
        console.log('Initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  // ── Fetch cart from server ────────────────────────────────────────────────
  const fetchCartFromServer = useCallback(async (accessToken) => {
    try {
      const res = await getCart(accessToken)
      if (res.success && res.cart) {
        setCart(res.cart.items || [])
      }
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        logout()
      } else {
        console.log('Cart fetch error:', error)
      }
    }
  }, [])

  // ── Fetch wishlist from server ────────────────────────────────────────────
  const fetchWishlistFromServer = useCallback(async (accessToken) => {
    if (!accessToken) return
    try {
      const res = await getWishList(accessToken)
      if (res.success) {
        setWishlist(res.products || [])
      }
    } catch (error) {
      console.log('Wishlist fetch error:', error)
    }
  }, [])


  // ── Cart actions ─────────────────────────────────────────────────────────
  const addToCart = useCallback(async (product, qty = 1) => {
    if (!user?.accessToken) return

    try {
      const res = await addToCartAPI(user.accessToken, product._id, qty)
      if (res.success) {
        setCart(res.cart.items || [])
      }
    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        logout()
      } else {
        console.error('Add to cart error:', error)
      }
    }
  }, [user])

  const updateQty = useCallback(async (productId, qty) => {
    if (!user?.accessToken) return

    try {
      const res = await updateCartItemAPI(user.accessToken, productId, qty)
      if (res.success) {
        setCart(res.cart.items || [])
      }
    } catch (error) {
      console.error('Update qty error:', error)
    }
  }, [user])

  const removeFromCart = useCallback(async (productId) => {
    if (!user?.accessToken) return

    try {
      const res = await removeFromCartAPI(user.accessToken, productId)
      if (res.success) {
        setCart(res.cart.items || [])
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
    }
  }, [user])

  const clearCart = useCallback(async () => {
    if (!user?.accessToken) return

    try {
      await clearCartAPI(user.accessToken)
      setCart([])
    } catch (error) {
      console.error('Clear cart error:', error)
    }
  }, [user])

  // ── Auth ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await authLogout(); } catch (err) { console.error("Logout error:", err); }
    setUser(null)
    setCart([])
    setWishlist([])
    localStorage.removeItem('user')
  }


  return (
    <AppContext.Provider value={{
      user, setUser,
      loading, setLoading,
      logout,
      wishlist, setWishlist, wishlistCount,
      allProduct, setAllProduct,
      // Cart
      cart, setCart,
      cartCount, cartTotal,
      cartOpen, setCartOpen,
      addToCart, updateQty, removeFromCart, clearCart,
      fetchCartFromServer,
      fetchWishlistFromServer,
    }}>

      {children}
    </AppContext.Provider>
  )
}
