import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import styles from './ProductDetails.module.css';
import MostViewItem from '../MostView/MostViewItems'
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';
import {
    IndianRupee,
    Heart,
    Share2,
    MessageCircle,
    Edit2,
    Trash2,
    MapPin,
    ArrowLeft,
    ShoppingCart,
    Zap,
    Plus,
    Minus,
    AlertTriangle,
} from 'lucide-react';
import { deleteItem, fetchProductData, toggleLike } from './api';


const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addToCart, setCartOpen } = useContext(AppContext);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [delToggle, setDelToggle] = useState(false);

    // Like states
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetchProductData(id);
                setProduct(res.product);
                setMainImage(res.product.images[0]);
                
                // Initialize like state
                if (res.product && user?.user?._id) {
                    setLiked(res.product.likes?.includes(user.user._id));
                    setLikeCount(res.product.likes?.length || 0);
                } else {
                    setLikeCount(res.product.likes?.length || 0);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch product", error);
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, delToggle, user?.user?._id]);


    if (isLoading) return <div className={styles.loader}>Loading...</div>;
    if (!product) return <div className={styles.error}>Product not found</div>;

    const isOwner = user?.user?._id === product.owner?._id;
    const discountPercent = product.offer && product.price
        ? Math.round(((product.price - product.offer) / product.price) * 100)
        : 0;
    const displayPrice = product.offer || product.price;

    const handleDelete = () => {
        toast((t) => (
            <div className={styles.toastConfirm}>
                <div className={styles.toastHeader}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <p>Delete Product?</p>
                </div>
                <p className={styles.toastMsg}>Are you sure you want to permanently delete this item from the store?</p>
                <div className={styles.toastActions}>
                    <button onClick={() => toast.dismiss(t.id)} className={styles.toastBtnNo}>Keep</button>
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        performDelete();
                    }} className={styles.toastBtnYes}>Yes, delete</button>
                </div>
            </div>
        ), { duration: 5000, style: { padding: '16px', borderRadius: '12px' } });
    };

    const performDelete = async () => {
        try {
            const res = await deleteItem(user.accessToken, String(product._id));
            if (res.success) {
                toast.success("Deleted successfully");
                navigate("/");
                setDelToggle(prev => !prev);
            } else {
                toast.error("Failed to delete");
            }
        } catch (err) {
            toast.error("Error deleting product");
        }
    };

    const handleAddToCart = async () => {
        if (!user) { navigate('/auth?view=login'); return; }
        if (addingToCart) return;
        setAddingToCart(true);
        try {
            await addToCart(product, qty);
            setCartOpen(true);
        } finally {
            setTimeout(() => setAddingToCart(false), 700);
        }
    };

    const handleBuyNow = async () => {
        if (!user) { navigate('/auth?view=login'); return; }
        await addToCart(product, qty);
        navigate('/checkout');
    };

    const handleLike = async (e) => {
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


        // Optimistic Update
        const wasLiked = liked;
        const prevCount = likeCount;

        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

        // Heart animation
        if (!wasLiked) {
            const rect = e.currentTarget.getBoundingClientRect();
            for (let i = 0; i < 3; i++) {
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.className = styles.floatingHeart;
                heart.style.left = `${rect.left + rect.width / 2 - 10 + (Math.random() * 20 - 10)}px`;
                heart.style.top = `${rect.top}px`;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 800);
            }
        }

        try {
            const res = await toggleLike(user.accessToken, product._id);
            if (!res.success) {
                setLiked(wasLiked);
                setLikeCount(prevCount);
                toast.error("Failed to update wishlist");
            }
        } catch (error) {
            setLiked(wasLiked);
            setLikeCount(prevCount);
            console.error("Like error:", error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };


    return (
        <div className={styles.pageContainer}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back to listings
            </button>

            <div className={styles.gridContainer}>
                {/* Left Column: Images */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImageWrapper}>
                        <img src={mainImage} alt={product.title} className={styles.mainImage} />
                        <span className={styles.categoryBadge}>{product.category}</span>
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className={styles.thumbnailContainer}>
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`${styles.thumbnail} ${mainImage === img ? styles.activeThumbnail : ''}`}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className={styles.detailsSection}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{product.title}</h1>
                        <div className={styles.actions}>
                            <button 
                                className={styles.iconButton} 
                                title="Share"
                                onClick={handleShare}
                            >
                                <Share2 size={18} />
                            </button>
                            <button 
                                className={styles.iconButton} 
                                title="Save"
                                onClick={handleLike}
                                style={{ color: liked ? '#ef4444' : '#6b7280' }}
                            >
                                <Heart size={18} fill={liked ? '#ef4444' : 'none'} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px' }}>{likeCount}</span>
                            </button>
                        </div>

                    </div>

                    <div className={styles.priceContainer}>
                        {product.offer ? (
                            <>
                                <span className={styles.currentPrice}><IndianRupee size={24} />{product.offer.toLocaleString()}</span>
                                <span className={styles.originalPrice}><IndianRupee size={16} />{product.price.toLocaleString()}</span>
                                <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                            </>
                        ) : (
                            <span className={styles.currentPrice}><IndianRupee size={24} />{product.price.toLocaleString()}</span>
                        )}
                    </div>

                    {product.location && (
                        <div className={styles.location}>
                            <MapPin size={16} className={styles.locationIcon} />
                            <span>calicut</span>
                        </div>
                    )}

                    <div className={styles.descriptionCard}>
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    {/* Qty + CTA — only for non-owners */}
                    {!isOwner && (
                        <div className={styles.buySection}>
                            {/* Quantity stepper */}
                            <div className={styles.qtySelector}>
                                <span className={styles.qtyLabel}>Qty</span>
                                <div className={styles.qtyControls}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        aria-label="Decrease"
                                    ><Minus size={14} /></button>
                                    <span className={styles.qtyValue}>{qty}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setQty(q => q + 1)}
                                        aria-label="Increase"
                                    ><Plus size={14} /></button>
                                </div>
                                <span className={styles.totalPrice}>
                                    = <IndianRupee size={13} />{(displayPrice * qty).toLocaleString()}
                                </span>
                            </div>

                            {/* CTA Buttons */}
                            <div className={styles.ctaButtons}>
                                <button
                                    className={`${styles.addToCartBtn} ${addingToCart ? styles.addingToCart : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    <ShoppingCart size={18} />
                                    {addingToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </button>
                                <button className={styles.buyNowBtn} onClick={handleBuyNow}>
                                    <Zap size={18} />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.ownerCard}>
                        <div className={styles.ownerInfo}>
                            {product.owner?.avatar ? (
                                <img src={product.owner.avatar} alt="owner" className={styles.ownerAvatar} />
                            ) : (
                                <div className={styles.ownerInitial}>
                                    {product.owner?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                            <div>
                                <h4 className={styles.ownerName}>{product.owner?.name || 'User'}</h4>
                                <span className={styles.ownerSince}>Member since {formatDate(product.owner?.createdAt) || 'recently'}</span>
                            </div>
                        </div>

                        {!isOwner ? (
                            <button 
                                className={styles.contactButton}
                                onClick={() => {
                                    const text = encodeURIComponent(`Hi, I'm interested in your product: ${product.title}\nLink: ${window.location.href}`);
                                    window.open(`https://wa.me/${product.owner?.phoneNumber || '911234567890'}?text=${text}`, '_blank');
                                }}
                            >
                                <MessageCircle size={18} />
                                Chat with Seller
                            </button>
                        ) : (
                            <div className={styles.ownerActions}>
                                <button className={styles.editButton} onClick={() => navigate(`/editItems/${product._id}`)}>
                                    <Edit2 size={16} /> Edit Details
                                </button>
                                <button className={styles.deleteButton} onClick={handleDelete}>
                                    <Trash2 size={16} /> Delete Listing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MostViewItem />
        </div>
    );
};

export default ProductDetails;