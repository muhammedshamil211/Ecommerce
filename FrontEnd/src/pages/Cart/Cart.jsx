import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Cart.module.css';
import { AppContext } from '../../context/AppContext';
import { IndianRupee, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { cart, updateQty, removeFromCart, cartTotal } = useContext(AppContext);
    const navigate = useNavigate();

    const DELIVERY_FEE = cartTotal > 500 ? 0 : 49;
    const TAX = Math.round(cartTotal * 0.03);
    const grandTotal = cartTotal + DELIVERY_FEE + TAX;

    if (cart.length === 0) {
        return (
            <div className={styles.emptyPage}>
                <ShoppingBag size={72} strokeWidth={1.2} className={styles.emptyIcon} />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <button className={styles.shopBtn} onClick={() => navigate('/')}>
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Shopping Cart</h1>
                <span className={styles.itemCount}>{cart.reduce((a, i) => a + i.qty, 0)} items</span>
            </div>

            <div className={styles.layout}>
                {/* Items */}
                <div className={styles.itemsSection}>
                    {cart.map((item) => {
                        const product = item.product;
                        if (!product) return null;
                        const price = product.offer || product.price;
                        const image = product.images?.[0] || 'https://placehold.co/100x100?text=no+img';
                        return (
                            <div key={product._id} className={styles.cartItem}>
                                <button
                                    className={styles.imgBtn}
                                    onClick={() => navigate(`/productDetails/${product._id}`)}
                                    aria-label={`View ${product.title}`}
                                >
                                    <img src={image} alt={product.title} className={styles.itemImg} />
                                </button>
                                <div className={styles.itemDetails}>
                                    <Link
                                        to={`/productDetails/${product._id}`}
                                        className={styles.itemTitle}
                                    >
                                        {product.title}
                                    </Link>
                                    <p className={styles.itemCategory}>{product.category}</p>
                                    <div className={styles.itemMeta}>
                                        <div className={styles.qtyControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => item.qty > 1 ? updateQty(product._id, item.qty - 1) : removeFromCart(product._id)}
                                            ><Minus size={13} /></button>
                                            <span className={styles.qtyValue}>{item.qty}</span>
                                            <button className={styles.qtyBtn} onClick={() => updateQty(product._id, item.qty + 1)}>
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                        <div className={styles.itemPriceGroup}>
                                            <span className={styles.unitPrice}>
                                                <IndianRupee size={12} />{price.toLocaleString()} each
                                            </span>
                                            <span className={styles.lineTotal}>
                                                <IndianRupee size={14} />{(price * item.qty).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.removeBtn} onClick={() => removeFromCart(product._id)} aria-label="Remove">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    <div className={styles.summaryRows}>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span><IndianRupee size={13} />{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Delivery</span>
                            <span className={DELIVERY_FEE === 0 ? styles.free : ''}>
                                {DELIVERY_FEE === 0 ? 'Free' : `₹${DELIVERY_FEE}`}
                            </span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>GST (3%)</span>
                            <span><IndianRupee size={13} />{TAX.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span className={styles.totalAmount}><IndianRupee size={16} />{grandTotal.toLocaleString()}</span>
                    </div>

                    {DELIVERY_FEE > 0 && (
                        <p className={styles.freeShipNote}>
                            Add <IndianRupee size={12} />{(500 - cartTotal)} more for free delivery
                        </p>
                    )}

                    <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                        Proceed to Checkout <ArrowRight size={18} />
                    </button>

                    <button className={styles.continueBtn} onClick={() => navigate('/')}>
                        ← Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
