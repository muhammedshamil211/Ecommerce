import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import styles from './ProductDetails.module.css';
import { formatDate } from '../../utils';
import {
    IndianRupee,
    Heart,
    Share2,
    MessageCircle,
    Edit2,
    Trash2,
    MapPin,
    ArrowLeft
} from 'lucide-react';
// Import your fetch/delete APIs here:
import { deleteItem, fetchProductData } from '../../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    // State to hold product data and selected image
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Simulated fetch - Replace this with your actual API call
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetchProductData(id);

                setProduct(res.product);
                setMainImage(res.product.images[0]);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch product", error);
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (isLoading) return <div className={styles.loader}>Loading...</div>;
    if (!product) return <div className={styles.error}>Product not found</div>;

    const isOwner = user?.user?._id === product.owner._id;
    const discountPercent = product.offer && product.price
        ? Math.round(((product.price - product.offer) / product.price) * 100)
        : 0;

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const res = await deleteItem(user.accessToken, product._id);
                if (res.success) {
                    alert("Deleted successfully");
                    navigate('/');
                }
            } catch (error) {
                alert("Failed to delete");
                console.log(error);
            }
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
                            <button className={styles.iconButton} title="Share"><Share2 size={18} /></button>
                            <button className={styles.iconButton} title="Save"><Heart size={18} /></button>
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
                            <button className={styles.contactButton}>
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
        </div>
    );
};

export default ProductDetails;