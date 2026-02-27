import React from 'react'
import { Search, User, Heart, ShoppingCart } from 'lucide-react'
import styles from './Header.module.css'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'

export default function Header({ onProfileClick, user }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <h1>Shoppy</h1>
          </div>
          <div className={styles.category}>
            <a href="">MEN</a>
            <a href="">WOMEN</a>
            <a href="">KIDS</a>
            <a href="">HOME</a>
            <a href="">BEAUTY</a>
            <a href="">GADGETS</a>
          </div>

          <div className={styles.search}>
            <input id="site-search" type="text" placeholder="Search for product, brand and more" />
            <button type="button" aria-label="Search" className={styles.searchButton}>
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className={styles.actions}>

          {/* {!user ? (
          <button onClick={onProfileClick}>Login</button>) :
          // ) : <<button
          //   type="button"
          //   className={styles.action}
          //   aria-label="Profile"
          // >
          //   <User className={styles.actionIcon} />
          //   <span className={styles.actionLabel}>
          //     {user ? (user.user.name || user.user.email || 'Profile') : 'Profile'}
          //   </span>
          // </button>} */}
          <ProfileDropdown
            onProfileClick={onProfileClick}
            user={user}
          />

          <button type="button" className={styles.action} aria-label="Wishlist">
            <Heart className={styles.actionIcon} />
            <span className={styles.actionLabel}>Wishlist</span>
          </button>

          <button type="button" className={styles.action} aria-label="Cart">
            <ShoppingCart className={styles.actionIcon} />
            <span className={styles.actionLabel}>Cart</span>
          </button>
        </div>
      </div>
    </header>
  )
}
