import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart } from 'lucide-react'
import styles from './Header.module.css'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'
import CartDrawer from '../CartDrawer/CartDrawer'
import { AppContext } from '../../context/AppContext'
import { allItems } from '../../services/productApi'

export default function Header({ onProfileClick, user }) {

  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const { setAllProduct, cartCount, setCartOpen, wishlistCount } = useContext(AppContext);
  const [badgeBump, setBadgeBump] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await allItems(key);
      if (res.success) {
        setAllProduct(res.products);
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleProfileClick = () => {
    if (!user) {
      navigate('/auth?view=login')
    }
    onProfileClick?.()
  }

  useEffect(() => {
    if (key === "") {
      handleSearch();
    }
  }, [key]);

  // Bump animation on cart count change
  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 400);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  return (
    <>
      <header className={styles.header}>
        {/* Top Row: Logo, Search, Actions */}
        <div className={styles.topMain}>
          <div className={styles.brand}>
            <h1 onClick={() => navigate("/")}>Shoppy</h1>
          </div>

          <div className={styles.search}>
            <input
              id="site-search"
              type="text"
              placeholder="Search for products, brands and more..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }} />
            <button type="button" aria-label="Search" className={styles.searchButton} onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>

          <div className={styles.actions}>
            <ProfileDropdown
              onProfileClick={handleProfileClick}
              user={user}
            />

            <button type="button" className={styles.action} aria-label="Wishlist" onClick={() => navigate("/product/wishlist")}>
              <span className={styles.cartIconWrapper}>
                <Heart className={styles.actionIcon} />
                {wishlistCount > 0 && (
                  <span className={styles.cartBadge}>
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </span>
              <span className={styles.actionLabel}>Wishlist</span>
            </button>

            <button
              type="button"
              className={styles.action}
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              id="cart-icon-btn"
            >
              <span className={styles.cartIconWrapper}>
                <ShoppingCart className={styles.actionIcon} />
                {cartCount > 0 && (
                  <span className={`${styles.cartBadge} ${badgeBump ? styles.badgeBump : ''}`}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              <span className={styles.actionLabel}>Cart</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Categories */}
        <nav className={styles.categoryNav}>
          <a href="#electronics" onClick={() => navigate("/product/electronics")} >Electronics</a>
          <a href="#fashion" onClick={() => navigate("/product/fashion")}>Fashion</a>
          <a href="#home" onClick={() => navigate("/product/home")}>Home</a>
          <a href="#sports" onClick={() => navigate("/product/sports")}>Sports</a>
          <a href="#toys" onClick={() => navigate("/product/toys")}>Toys</a>
          <a href="#other" onClick={() => navigate("/product/other")}>Other</a>
        </nav>
      </header>

      {/* Cart Drawer rendered outside header to avoid z-index issues */}
      <CartDrawer />
    </>
  )
}