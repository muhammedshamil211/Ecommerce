import React, { useContext, useState } from "react";
import { User } from "lucide-react";
import styles from "./ProfileDropdown.module.css";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";


const ProfileDropdown = ({
    onProfileClick
}) => {
    const { user, logout } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleItemClick = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <div 
            className={styles.wrapper}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Profile Icon */}
            <div className={styles.profileIcon}>
                <div>
                    <User size={22} strokeWidth={1.8} />
                </div>
                <p>Profile</p>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                    {!user ? (
                        <div className={styles.header}>
                            <h4 className={styles.wel}>welcome</h4>
                            <p>To access account and manage orders and add item</p>
                            <button
                                className={styles.login}
                                onClick={() => {
                                    onProfileClick();
                                    handleItemClick();
                                }}
                            >
                                Login/Signup
                            </button>
                        </div>
                    ) : (
                        <div className={styles.header}>
                            <h4>Hello {user.user?.name.toUpperCase()}</h4>
                            <p>{user.user?.email}</p>
                        </div>
                    )}

                    <ul className={styles.menu}>
                        <li><Link to="/my-orders" onClick={handleItemClick}>My Bookings</Link></li>
                        <li><Link to="/product/wishlist" onClick={handleItemClick}>Wishlist</Link></li>
                        <li onClick={handleItemClick}>Gift Cards</li>
                        <li onClick={handleItemClick}>Contact Us</li>
                    </ul>

                    <div className={styles.divider}></div>

                    <ul className={styles.menu}>
                        <li onClick={handleItemClick}>Shoppy Credit</li>
                        <li onClick={handleItemClick}>Coupons</li>
                        <li onClick={handleItemClick}>Saved Cards</li>
                        <li onClick={handleItemClick}>Saved VPA</li>
                        <li onClick={handleItemClick}>Saved Addresses</li>
                        <li><Link to="/helpCenter" onClick={handleItemClick}>Help Center</Link></li>
                    </ul>

                    <div className={styles.divider}></div>

                    <ul className={styles.menu}>
                        <li><Link to='/profile' onClick={handleItemClick}>Edit Profile</Link></li>
                        <li><Link to='/addItems' onClick={handleItemClick}>Add Items</Link></li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;