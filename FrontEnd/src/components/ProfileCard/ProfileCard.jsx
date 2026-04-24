import React, { useContext, useEffect } from "react";
import styles from "./ProfileCard.module.css";
import { AppContext } from "../../context/AppContext";
import { formatDate } from "../../utils";
import { getWishList } from "../../pages/WishList/api";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ user, length, scrollToProduct }) {

    const navigate = useNavigate();
    const { wishlist, setWishlist } = useContext(AppContext);

    const firstLetter = user.user.name?.slice(0, 1).toUpperCase() || "U";
    const address = user.user.address || {};

    useEffect(() => {
        if (wishlist.length === 0 && user?.accessToken) {
            getWishList(user.accessToken).then(data => {
                setWishlist(data.products || []);
            });
        }
    }, [user, wishlist.length, setWishlist]);

    return (
        <div className={styles.card}>

            {/* TOP PROFILE SECTION */}

            <div className={styles.profileTop}>

                <div className={styles.avatar}>
                    {user.user.avathar ?
                        <img src={user.user.avathar} alt="avatar" />
                        :
                        <p>{firstLetter}</p>
                    }
                </div>

                <div className={styles.profileInfo}>
                    <h2>{user.user.name}</h2>
                    <p className={styles.email}>{user.user.email}</p>
                    <span className={styles.since}>
                        Member since {formatDate(user.user.createdAt)}
                    </span>
                </div>

                <button
                    className={styles.editBtn}
                    onClick={() => navigate("/updateUser")}
                >
                    Edit Profile
                </button>

            </div>


            {/* ADDRESS */}

            <div className={styles.addressSection}>

                <h3>Address</h3>

                {address.street ? (
                    <>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state}</p>
                        <p>{address.pincode}</p>
                    </>
                ) : (
                    <p className={styles.empty}>No address added</p>
                )}

            </div>


            {/* STATS */}

            <div className={styles.stats}>

                <div className={styles.stat}>
                    <span>Phone</span>
                    <p>{user.user.phoneNumber ? `+91 ${user.user.phoneNumber}` : "---"}</p>
                </div>

                <div className={styles.stat} onClick={scrollToProduct} style={{ cursor: "pointer" }}>
                    <span>Total Items</span>
                    <p>{length}</p>
                </div>

                <div className={styles.stat} onClick={() => navigate('/product/wishlist')} style={{ cursor: "pointer" }}>
                    <span>Wishlist</span>
                    <p>{wishlist.length}</p>
                </div>

            </div>

        </div>
    );
}