import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus, IndianRupee, ShoppingBag } from 'lucide-react';
import styles from './CartDrawer.module.css';
import { AppContext } from '../../context/AppContext';

export default function CartDrawer() {
    const { cart, cartOpen, setCartOpen, cartTotal, updateQty, removeFromCart } = useContext(AppContext);
    const drawerRef = useRef(null);
    const navigate = useNavigate();

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setCartOpen(false); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [setCartOpen]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = cartOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [cartOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) setCartOpen(false);
    };

    const goToCheckout = () => {
        setCartOpen(false);
        navigate('/checkout');
    };

    const goToCart = () => {
        setCartOpen(false);
        navigate('/cart');
    };

    const goToProduct = (productId) => {
        setCartOpen(false);
        navigate(`/productDetails/${productId}`);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.overlay} ${cartOpen ? styles.overlayVisible : ''}`}
                onClick={handleOverlayClick}
            />

            {/* Drawer */}
            <aside className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : ''}`} ref={drawerRef}>
                {/* Header */}
                <div className={styles.drawerHeader}>
                    <div className={styles.drawerTitle}>
                        <ShoppingCart size={20} />
                        <span>Your Cart</span>
                        {cart.length > 0 && (
                            <span className={styles.itemCount}>{cart.reduce((a, i) => a + i.qty, 0)} items</span>
                        )}
                    </div>
                    <button className={styles.closeBtn} onClick={() => setCartOpen(false)} aria-label="Close cart">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.drawerBody}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ShoppingBag size={56} strokeWidth={1.2} />
                            <h3>Your cart is empty</h3>
                            <p>Add items to start shopping</p>
                            <button className={styles.browseBtn} onClick={() => setCartOpen(false)}>
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <ul className={styles.itemList}>
                            {cart.map((item) => {
                                const product = item.product;
                                if (!product) return null;
                                const price = product.offer || product.price;
                                const image = product.images?.[0] || 'https://placehold.co/80x80?text=No+Image';
                                return (
                                    <li key={product._id} className={styles.cartItem}>
                                        {/* Clickable image → product page */}
                                        <button
                                            className={styles.itemImageBtn}
                                            onClick={() => goToProduct(product._id)}
                                            aria-label={`View ${product.title}`}
                                        >
                                            <img src={image} alt={product.title} className={styles.itemImage} />
                                        </button>

                                        <div className={styles.itemInfo}>
                                            {/* Clickable title → product page */}
                                            <button
                                                className={styles.itemTitleBtn}
                                                onClick={() => goToProduct(product._id)}
                                            >
                                                {product.title}
                                            </button>

                                            <div className={styles.itemPrice}>
                                                <IndianRupee size={12} />
                                                <span>{(price * item.qty).toLocaleString()}</span>
                                            </div>
                                            <div className={styles.qtyRow}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => item.qty > 1 ? updateQty(product._id, item.qty - 1) : removeFromCart(product._id)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className={styles.qty}>{item.qty}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQty(product._id, item.qty + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(product._id)}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className={styles.drawerFooter}>
                        <div className={styles.subtotal}>
                            <span>Subtotal</span>
                            <span className={styles.subtotalAmount}>
                                <IndianRupee size={14} /> {cartTotal.toLocaleString()}
                            </span>
                        </div>
                        <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
                        <div className={styles.footerActions}>
                            <button className={styles.viewCartBtn} onClick={goToCart}>View Cart</button>
                            <button className={styles.checkoutBtn} onClick={goToCheckout}>
                                Checkout →
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
