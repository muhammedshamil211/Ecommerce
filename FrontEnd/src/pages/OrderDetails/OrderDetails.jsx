import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getOrderByIdAPI, cancelOrderAPI } from '../../services/api';
import styles from './OrderDetails.module.css';
import { ArrowLeft, IndianRupee, MapPin, CreditCard, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
    { id: 'placed', label: 'Order Placed' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' }
];

const OrderDetailsSkeleton = () => (
    <div className={styles.page}>
        <div className={styles.container}>
            <div className={styles.skeletonHeader}>
                <div className={`${styles.skeleton} ${styles.skeletonBack}`} />
                <div className={styles.skeletonTitleRow}>
                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
                </div>
                <div className={`${styles.skeleton} ${styles.skeletonDate}`} />
            </div>

            <div className={`${styles.skeleton} ${styles.skeletonTracking}`} />

            <div className={styles.grid}>
                <div className={styles.itemsSection}>
                    <div className={styles.card}>
                        <div className={`${styles.skeleton} ${styles.cardTitle}`} style={{ width: '120px' }} />
                        {[1, 2, 3].map(i => (
                            <div key={i} className={styles.skeletonItemRow}>
                                <div className={`${styles.skeleton} ${styles.skeletonItemImg}`} />
                                <div className={styles.skeletonItemInfo}>
                                    <div className={`${styles.skeleton} ${styles.skeletonItemName}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonItemQty}`} />
                                </div>
                                <div className={`${styles.skeleton} ${styles.skeletonItemPrice}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.card}>
                        <div className={`${styles.skeleton} ${styles.cardTitle}`} style={{ width: '150px' }} />
                        <div className={styles.infoRow}>
                            <div className={`${styles.skeleton} ${styles.infoIcon}`} style={{ width: '18px', height: '18px' }} />
                            <div className={styles.skeletonInfoText}>
                                <div className={`${styles.skeleton} ${styles.skeletonTextLine}`} />
                                <div className={`${styles.skeleton} ${styles.skeletonTextLineShort}`} />
                                <div className={`${styles.skeleton} ${styles.skeletonTextLine}`} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={`${styles.skeleton} ${styles.cardTitle}`} style={{ width: '140px' }} />
                        <div className={styles.infoRow}>
                            <div className={`${styles.skeleton} ${styles.infoIcon}`} style={{ width: '18px', height: '18px' }} />
                            <div className={`${styles.skeleton} ${styles.skeletonTextLine}`} style={{ width: '100px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function OrderDetails() {
    const { id } = useParams();
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (user && id) fetchOrder();
    }, [user, id]);

    const fetchOrder = async () => {
        try {
            const res = await getOrderByIdAPI(user.accessToken, id);
            if (res.success) {
                setOrder(res.order);
            } else {
                setError(res.message || 'Order not found');
            }
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        toast((t) => (
            <div className={styles.toastConfirm}>
                <div className={styles.toastHeader}>
                    <AlertTriangle size={18} color="#ef4444" />
                    <p>Cancel Booking?</p>
                </div>
                <p className={styles.toastMsg}>Are you sure you want to cancel this booking? This action cannot be reversed.</p>
                <div className={styles.toastActions}>
                    <button onClick={() => toast.dismiss(t.id)} className={styles.toastBtnNo}>Keep</button>
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        performCancel();
                    }} className={styles.toastBtnYes}>Yes, cancel</button>
                </div>
            </div>
        ), { duration: 5000, style: { padding: '16px', borderRadius: '12px' } });
    };

    const performCancel = async () => {
        setCancelling(true);
        try {
            const res = await cancelOrderAPI(user.accessToken, id);
            if (res.success) {
                setOrder(res.order); // Update state to show as cancelled
                toast.success('Order cancelled successfully');
            } else {
                toast.error(res.message || 'Failed to cancel order');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <OrderDetailsSkeleton />;
    if (error || !order) {
        return (
            <div className={styles.errorContainer}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <h2>Oops!</h2>
                <p>{error || 'Order not found'}</p>
                <Link to="/my-orders" className={styles.backBtn}>Back to My Bookings</Link>
            </div>
        );
    }

    const { shippingAddress, paymentMethod, items, totalAmount, orderStatus, orderId, createdAt } = order;
    const isCancelled = orderStatus === 'cancelled';
    const canCancel = ['placed', 'processing'].includes(orderStatus);

    // Determine current step index for the progress bar
    const currentStepIdx = STATUS_STEPS.findIndex(s => s.id === orderStatus);

    const date = new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backLink}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>Booking #{orderId}</h1>
                        {isCancelled ? (
                            <div className={styles.cancelledBadge}>
                                <XCircle size={14} /> Cancelled
                            </div>
                        ) : (
                            <div className={styles.activeBadge}>
                                {orderStatus.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <p className={styles.dateText}>Placed on {date}</p>
                </div>

                {/* Tracking Progress */}
                {!isCancelled && (
                    <div className={styles.trackingCard}>
                        <h2 className={styles.cardTitle}>Tracking Status</h2>
                        <div className={styles.stepper}>
                            {STATUS_STEPS.map((step, idx) => {
                                const isCompleted = currentStepIdx >= idx;
                                const isCurrent = currentStepIdx === idx;
                                return (
                                    <div key={step.id} className={styles.step}>
                                        <div className={`${styles.stepIcon} ${isCompleted ? styles.stepCompleted : ''} ${isCurrent ? styles.stepCurrent : ''}`}>
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <div className={`${styles.stepLabel} ${isCompleted ? styles.labelCompleted : ''}`}>
                                            {step.label}
                                        </div>
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div className={`${styles.stepLine} ${currentStepIdx > idx ? styles.lineCompleted : ''}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Cancellation Card */}
                {isCancelled && (
                    <div className={styles.cancelledCard}>
                        <h3>Booking Cancelled</h3>
                        <p>This order was cancelled and will not be fulfilled. Any payments made will be refunded within 3-5 business days.</p>
                    </div>
                )}

                <div className={styles.grid}>
                    {/* Left: Items */}
                    <div className={styles.itemsSection}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Items Booked</h2>
                            <ul className={styles.itemList}>
                                {items.map(item => (
                                    <li key={item.product || item._id} className={styles.itemRow}>
                                        <img src={item.image || 'https://placehold.co/80'} alt={item.title} className={styles.itemImg} />
                                        <div className={styles.itemInfo}>
                                            <h3 className={styles.itemName}>{item.title}</h3>
                                            <p className={styles.itemQty}>Qty: {item.qty}</p>
                                        </div>
                                        <div className={styles.itemPrice}>
                                            <IndianRupee size={12} /> {(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.totalRow}>
                                <span>Grand Total</span>
                                <span className={styles.totalAmt}>
                                    <IndianRupee size={16} /> {totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className={styles.infoSection}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Shipping Details</h2>
                            <div className={styles.infoRow}>
                                <MapPin size={18} className={styles.infoIcon} />
                                <div className={styles.infoText}>
                                    <strong>{shippingAddress.name}</strong>
                                    <p>{shippingAddress.street}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pin}</p>
                                    <p>📞 {shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Payment Method</h2>
                            <div className={styles.infoRow}>
                                <CreditCard size={18} className={styles.infoIcon} />
                                <div className={styles.infoText}>
                                    <p style={{ textTransform: 'uppercase', fontWeight: '600' }}>
                                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {canCancel && (
                            <div className={styles.actionsCard}>
                                <p className={styles.actionNote}>Changed your mind? You can cancel before it ships.</p>
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className={styles.cancelBtn}
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
