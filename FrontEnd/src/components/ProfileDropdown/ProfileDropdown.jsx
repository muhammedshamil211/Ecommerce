import React, { useContext } from "react";
import { User } from "lucide-react";
import styles from "./ProfileDropdown.module.css";
import { logout } from "../../services/api";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const ProfileDropdown = ({
    onProfileClick
}) => {

    const { user, setUser } = useContext(AppContext);

    return (
        <div className={styles.wrapper}>
            {/* Profile Icon */}
            <div className={styles.profileIcon}>
                <div>
                    <User size={22} strokeWidth={1.8} />
                </div>
                <p>Profile</p>
            </div>

            {/* Dropdown */}
            <div className={styles.dropdown}>

                {!user ? <div className={styles.header}>
                    <h4 className={styles.wel}>welcome</h4>
                    <p>To access account and manage orders and add item</p>
                    <button className={styles.login} onClick={onProfileClick}>Login/Signup</button>
                </div>
                    : <div className={styles.header}>
                        <h4>Hello {user.user.name.toUpperCase()}</h4>
                        <p>{user.user.email}</p>
                    </div>}


                <ul className={styles.menu}>
                    <li>Orders</li>
                    <li>Wishlist</li>
                    <li>Gift Cards</li>
                    <li>Contact Us</li>
                </ul>

                <div className={styles.divider}></div>

                <ul className={styles.menu}>
                    <li>Shoppy Credit</li>
                    <li>Coupons</li>
                    <li>Saved Cards</li>
                    <li>Saved VPA</li>
                    <li>Saved Addresses</li>
                </ul>

                <div className={styles.divider}></div>

                <ul className={styles.menu}>
                    <li><Link to='/profile'>Edit Profile</Link></li>
                    <li><Link to='/addItems'>Add Items</Link></li>
                    <li onClick={async () => {
                        await logout();
                        setUser(null);
                    }}>Logout</li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileDropdown;