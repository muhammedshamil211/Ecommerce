import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OrderSuccess.module.css';
import { CheckCircle, IndianRupee, Package, Home } from 'lucide-react';

const STATUS_COLORS = {
    placed: '#2563eb',
    processing: '#d97706',
    shipped: '#7c3aed',
    delivered: '#16a34a',
    cancelled: '#ef4444',
};

export default function OrderSuccess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Animated check */}
                <div className={styles.checkWrapper}>
                    <CheckCircle className={styles.checkIcon} size={72} strokeWidth={1.5} />
                </div>

                <h1 className={styles.title}>Order Placed!</h1>
                <p className={styles.subtitle}>
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                {order && (
                    <>
                        <div className={styles.orderIdRow}>
                            <span className={styles.orderId}>#{order.orderId}</span>
                            <span
                                className={styles.statusBadge}
                                style={{ background: STATUS_COLORS[order.orderStatus] || '#2563eb' }}
                            >
                                {order.orderStatus}
                            </span>
                        </div>

                        {/* Items */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}><Package size={16} /> Items Ordered</h3>
                            <ul className={styles.itemList}>
                                {order.items.map((item, i) => (
                                    <li key={i} className={styles.orderItem}>
                                        {item.image && (
                                            <img src={item.image} alt={item.title} className={styles.itemImg} />
                                        )}
                                        <span className={styles.itemTitle}>{item.title}</span>
                                        <span className={styles.itemQty}>×{item.qty}</span>
                                        <span className={styles.itemPrice}>
                                            <IndianRupee size={11} />{(item.price * item.qty).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Address */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Delivering to</h3>
                            <p className={styles.address}>
                                {order.shippingAddress.name}<br />
                                {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                                {order.shippingAddress.state} — {order.shippingAddress.pin}
                            </p>
                        </div>

                        {/* Total */}
                        <div className={styles.totalRow}>
                            <span>Amount Paid</span>
                            <span className={styles.totalAmt}>
                                <IndianRupee size={15} />{order.totalAmount?.toLocaleString()}
                            </span>
                        </div>

                        <p className={styles.paymentNote}>
                            Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong>
                        </p>
                    </>
                )}

                <div className={styles.actions}>
                    <button className={styles.primaryBtn} onClick={() => navigate('/')}>
                        <Home size={16} /> Continue Shopping
                    </button>
                    <button className={styles.secondaryBtn} onClick={() => navigate('/my-orders')}>
                        View My Bookings
                    </button>
                </div>
            </div>
        </div>
    );
}
