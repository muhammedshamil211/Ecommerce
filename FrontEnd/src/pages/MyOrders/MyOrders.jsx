import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getMyOrdersAPI } from './api';
import styles from './MyOrders.module.css';
import { IndianRupee, PackageOpen, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

const MyOrdersSkeleton = () => (
    <div className={styles.orderList}>
        {[1, 2, 3].map(i => (
            <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeleton} ${styles.skeletonOrderId}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
                </div>
                <div className={styles.skeletonBody}>
                    <div className={styles.skeletonGallery}>
                        <div className={`${styles.skeleton} ${styles.skeletonThumnail}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonThumnail}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonThumnail}`} />
                    </div>
                    <div className={styles.skeletonMeta}>
                        <div className={`${styles.skeleton} ${styles.skeletonMetaLine}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonMetaLine}`} />
                    </div>
                </div>
                <div className={styles.skeletonFooter}>
                    <div className={`${styles.skeleton} ${styles.skeletonBtn}`} />
                </div>
            </div>
        ))}
    </div>
);

export default function MyOrders() {
    const { user } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchOrders(1);
        }
    }, [user]);

    const fetchOrders = async (pageNum) => {
        setLoading(true);
        try {
            const res = await getMyOrdersAPI(user.accessToken, pageNum);
            if (res.success) {
                setOrders(res.orders);
                setPage(res.page);
                setTotalPages(res.totalPages);
            } else {
                setError(res.message || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'placed': return { color: styles.statusPlaced, label: 'Placed', dot: '🔵' };
            case 'processing': return { color: styles.statusProcessing, label: 'Processing', dot: '🟡' };
            case 'shipped': return { color: styles.statusShipped, label: 'Shipped', dot: '🟣' };
            case 'delivered': return { color: styles.statusDelivered, label: 'Delivered', dot: '🟢' };
            case 'cancelled': return { color: styles.statusCancelled, label: 'Cancelled', dot: '🔴' };
            default: return { color: styles.statusPlaced, label: status, dot: '⚪' };
        }
    };

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h2>Please log in to view your bookings</h2>
                    <Link to="/login" className={styles.primaryBtn}>Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Bookings</h1>
                <p className={styles.subtitle}>View and track all your orders and bookings</p>
            </div>

            {error && (
                <div className={styles.errorMsg}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {loading && orders.length === 0 ? (
                <MyOrdersSkeleton />
            ) : orders.length === 0 && !error ? (
                <div className={styles.emptyState}>
                    <PackageOpen size={64} className={styles.emptyIcon} strokeWidth={1} />
                    <h2>No bookings yet</h2>
                    <p>Looks like you haven't booked or ordered anything yet.</p>
                    <Link to="/" className={styles.primaryBtn}>Explore Products</Link>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {orders.map(order => {
                        const { color, label, dot } = getStatusDetails(order.orderStatus);
                        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        });

                        return (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.headerLeft}>
                                        <span className={styles.orderId}>Order #{order.orderId}</span>
                                        <div className={styles.dateRow}>
                                            <Calendar size={14} />
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.statusBadge} ${color}`}>
                                        {dot} {label}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.imageGallery}>
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <img
                                                key={item._id || idx}
                                                src={item.image || 'https://placehold.co/60x60?text=img'}
                                                alt={item.title}
                                                className={styles.thumnail}
                                            />
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className={styles.moreCount}>+{order.items.length - 3}</div>
                                        )}
                                    </div>

                                    <div className={styles.orderMeta}>
                                        <p className={styles.metaLabel}>Total Items: <span className={styles.metaVal}>{order.items.reduce((a, b) => a + b.qty, 0)}</span></p>
                                        <p className={styles.metaLabel}>Total Amount:
                                            <span className={styles.totalAmt}>
                                                <IndianRupee size={12} /> {order.totalAmount.toLocaleString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <Link to={`/my-orders/${order._id}`} className={styles.viewDetailsBtn}>
                                        View Details <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => fetchOrders(page - 1)}
                                className={styles.pageBtn}
                            >
                                Prev
                            </button>
                            <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages || loading}
                                onClick={() => fetchOrders(page + 1)}
                                className={styles.pageBtn}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
