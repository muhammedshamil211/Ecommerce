import React, { useContext, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { AppContext } from '../../context/AppContext';
import { Edit2, IndianRupee, Trash2, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';
import { deleteItem, toggleLike } from '../../services/productApi';
import toast from 'react-hot-toast';

export const ProductCardSkeleton = () => (
    <div className={styles.skeletonCard}>
        <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
        <div className={styles.content}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonPrice}`} />
            <div className={styles.skeletonFooter}>
                <div className={styles.skeletonOwner}>
                    <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonOwnerName}`} />
                </div>
                <div className={`${styles.skeleton} ${styles.skeletonStats}`} />
            </div>
        </div>
    </div>
);

const ProductCard = ({ product }) => {
    const { user, cart, addToCart, setCartOpen, allProduct, setAllProduct } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(product.likes?.includes(user?.user?._id));
    const [likeCount, setLikeCount] = useState(product.likes?.length || 0);
    const [addingToCart, setAddingToCart] = useState(false);
    const cardRef = useRef(null);

    const isProfilePage = location.pathname.includes("/profile");
    const isOwner = user?.user?._id === product.owner?._id;
    const showButton = isProfilePage && isOwner;

    // Check if this product is already in the cart
    const isInCart = cart.some(item => item.product?._id === product._id);

    const handleEditClick = (e) => {
        e.preventDefault();
        navigate(`/editItems/${product?._id}`);
    }

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/auth?view=login');
            return;
        }

        if (isOwner) {
            toast((t) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px' }}>
                    <div style={{ backgroundColor: '#fff7ed', borderRadius: '50%', padding: '8px', display: 'flex' }}>
                        <AlertTriangle size={20} color="#f97316" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>Action Restricted</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>You cannot wishlist your own product.</p>
                    </div>
                </div>
            ), {
                position: 'top-center',
                style: {
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#333',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f3f4f6'
                },
                duration: 3000
            });
            return;
        }


        // --- Optimistic Update ---
        const wasLiked = liked;
        const prevCount = likeCount;

        // Toggle local state immediately
        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

        // Only animate if WE ARE LIKING (not unliking)
        if (!wasLiked) {
            const heartBtn = e.currentTarget;
            const rect = heartBtn.getBoundingClientRect();
            
            // Spawn 3 hearts with slight offsets
            for(let i=0; i<3; i++) {
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.className = styles.floatingHeart;
                heart.style.left = `${rect.left + rect.width/2 - 10 + (Math.random() * 20 - 10)}px`;
                heart.style.top = `${rect.top}px`;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 800);
            }
        }

        try {
            const res = await toggleLike(user.accessToken, product._id);
            if (!res.success) {
                // Rollback if server fails
                setLiked(wasLiked);
                setLikeCount(prevCount);
                toast.error("Failed to update wishlist");
            }
        } catch (error) {
            // Rollback on network error
            setLiked(wasLiked);
            setLikeCount(prevCount);
            console.error("Like error:", error);
        }
    }

    const handleDeleteClick = (e) => {
        e.preventDefault();
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '240px', padding: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Delete Product?</strong>
                </div>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem', lineHeight: 1.4 }}>This will permanently remove the product from your store.</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                    >Keep</button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const res = await deleteItem(user.accessToken, product._id);
                                if (res.success) {
                                    toast.success('Product deleted successfully');
                                    setAllProduct(prev => prev.filter(p => p._id !== product._id));
                                } else {
                                    toast.error('Failed to delete product');
                                }
                            } catch {
                                toast.error('Failed to delete product');
                            }
                        }}
                        style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', boxShadow: '0 2px 4px rgba(239,68,68,0.2)' }}
                    >Yes, delete</button>
                </div>
            </div>
        ), { duration: 5000, style: { padding: '16px', borderRadius: '12px' } });
    };

    // ── Add to Cart / View in Cart ────────────────────────────────────────────
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/auth?view=login');
            return;
        }

        // Already in cart → just open the drawer
        if (isInCart) {
            setCartOpen(true);
            return;
        }

        if (addingToCart) return;
        setAddingToCart(true);

        // Launch fly animation
        flyToCart(cardRef.current);

        try {
            await addToCart(product, 1);
            setTimeout(() => setCartOpen(true), 600);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setAddingToCart(false), 700);
        }
    };

    const flyToCart = (cardEl) => {
        const imgEl = cardEl?.querySelector('img');
        const cartBtn = document.getElementById('cart-icon-btn');
        if (!imgEl || !cartBtn) return;

        const imgRect = imgEl.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();

        const clone = imgEl.cloneNode(true);
        clone.style.cssText = `
            position: fixed;
            top: ${imgRect.top}px;
            left: ${imgRect.left}px;
            width: ${imgRect.width}px;
            height: ${imgRect.height}px;
            z-index: 9999;
            border-radius: 8px;
            object-fit: cover;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 1;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        `;
        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                clone.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
                clone.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
                clone.style.width = '40px';
                clone.style.height = '40px';
                clone.style.opacity = '0.7';
                clone.style.borderRadius = '50%';
                clone.style.transform = 'scale(0.3)';
            });
        });

        setTimeout(() => clone.remove(), 700);
    };

    const discountPercent = product.offer && product.price
        ? Math.round(((product.price - product.offer) / product.price) * 100)
        : 0;

    return (
        <div className={`${styles.card} ${isInCart ? styles.inCart : ''}`} ref={cardRef}>
            <div className={styles.imageWrapper}>
                <Link to={`/productDetails/${product._id}`} className={styles.imageContainer}>
                    <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.title}
                        className={styles.image}
                    />
                    <div className={styles.categoryBadge}>{product.category}</div>
                    {/* In-cart overlay badge */}
                    {isInCart && (
                        <span className={styles.inCartBadge}>
                            <CheckCircle size={12} /> In Cart
                        </span>
                    )}
                </Link>

                {/* Add To Cart / View in Cart button */}
                {!showButton && !isOwner && (
                    <button
                        className={`${styles.addToCartBtn} ${isInCart ? styles.viewInCartBtn : ''} ${addingToCart ? styles.addingToCart : ''} `}
                        onClick={handleAddToCart}
                        aria-label={isInCart ? "View in cart" : "Add to cart"}
                    >
                        <ShoppingCart size={12} />
                        <span>{isInCart ? 'View in Cart' : (addingToCart ? 'Added!' : 'Add to Cart')}</span>
                    </button>
                )}

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
                <Link to={`/productDetails/${product._id}`} className={styles.titleWrapper}>
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
                        <button className={styles.statItem} onClick={handleLike}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={liked ? "red" : "none"} stroke="currentColor" color={liked ? "red" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.heartIcon}>
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{likeCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;