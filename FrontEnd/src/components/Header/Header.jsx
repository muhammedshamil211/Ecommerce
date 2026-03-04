import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart } from 'lucide-react'
import styles from './Header.module.css'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'

export default function Header({ onProfileClick, user }) {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    if (!user) {
      navigate('/auth?view=login')
    }
    onProfileClick?.()
  }

  return (
    <header className={styles.header}>
      {/* Top Row: Logo, Search, Actions */}
      <div className={styles.topMain}>
        <div className={styles.brand}>
          <h1 onClick={() => navigate("/")}>Shoppy</h1>
        </div>

        <div className={styles.search}>
          <input id="site-search" type="text" placeholder="Search for products, brands and more..." />
          <button type="button" aria-label="Search" className={styles.searchButton}>
            <Search size={18} />
          </button>
        </div>

        <div className={styles.actions}>
          <ProfileDropdown
            onProfileClick={handleProfileClick}
            user={user}
          />

          <button type="button" className={styles.action} aria-label="Wishlist" onClick={()=>navigate("/product/wishlist")}>
            <Heart className={styles.actionIcon} />
            <span className={styles.actionLabel}>Wishlist</span>
          </button>

          <button type="button" className={styles.action} aria-label="Cart">
            <ShoppingCart className={styles.actionIcon} />
            <span className={styles.actionLabel}>Cart</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Categories */}
      <nav className={styles.categoryNav}>
        <a href="#electronics" onClick={()=>navigate("/product/electronics")} >Electronics</a>
        <a href="#fashion" onClick={()=>navigate("/product/fashion")}>Fashion</a>
        <a href="#home" onClick={()=>navigate("/product/home")}>Home</a>
        <a href="#sports" onClick={()=>navigate("/product/sports")}>Sports</a>
        <a href="#toys" onClick={()=>navigate("/product/toys")}>Toys</a>
        <a href="#other" onClick={()=>navigate("/product/other")}>Other</a>
      </nav>
    </header>
  )
}