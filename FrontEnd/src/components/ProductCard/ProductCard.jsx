import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { AppContext } from '../../context/AppContext';
import { Delete, Edit2, IndianRupee, Trash2 } from 'lucide-react';
import { deleteItem } from '../../services/api';

const ProductCard = ({ product }) => {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isProfilePage = location.pathname.includes("/profile");

    const isOwner = user?.user?._id === product.owner ? true : false;
    const showButton = isProfilePage && isOwner;

    const handleEditClick = (e) => {
        e.preventDefault();
        navigate(`/editItems/${product._id}`);
    }

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        try {
            const res = await deleteItem(user.accessToken, product._id);

            if (res.success) {
                alert(res.message);
                window.location.reload();
            }

        } catch (error) {
            alert("Failed to delete");
            console.log(error);
        }

    }

    const discountPercent = product.offer && product.price
        ? Math.round(((product.price - product.offer) / product.price) * 100)
        : 0;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Link to={`/product/${product._id}`} className={styles.imageContainer}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.title}
                        className={styles.image}
                    />
                    <div className={styles.categoryBadge}>{product.category}</div>
                </Link>
                {showButton && (
                    <button className={styles.editButton} onClick={handleEditClick}>
                        <Edit2 size={12} />
                        <span>Edit</span>
                    </button>
                )}

                {showButton && (
                    <button className={styles.deleteButton} onClick={handleDeleteClick}>
                        <Trash2 size={12} />
                        <span>Delete</span>
                    </button>
                )}

            </div>

            <div className={styles.content}>
                <Link to={`/product/${product._id}`} className={styles.titleWrapper}>
                    <h3 className={styles.title} title={product.title}>{product.title}</h3>
                </Link>

                <div className={styles.priceContainer}>
                    {product.offer ? (
                        <>
                            <span className={styles.currentPrice}><IndianRupee size={14} />{product.offer}</span>
                            <span className={styles.originalPrice}><IndianRupee size={12} />{product.price}</span>
                            <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                        </>
                    ) : (
                        <span className={styles.currentPrice}> <IndianRupee size={14} /> {product.price}</span>
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.owner}>
                        {product.owner?.avatar ? (
                            <img src={product.owner.avatar} alt="owner" className={styles.ownerAvatar} />
                        ) : (
                            <div className={styles.ownerInitial}>
                                {product.owner?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                        )}
                        <span className={styles.ownerName} >{product.owner?.name?.split(' ')[0] || 'User'}</span>
                    </div>

                    <div className={styles.stats}>
                        <button className={styles.statItem} onClick={(e) => { e.preventDefault(); onLike(product._id); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.heartIcon}>
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{product.likeCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;