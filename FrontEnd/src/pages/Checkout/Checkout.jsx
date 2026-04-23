import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';
import { AppContext } from '../../context/AppContext';
import { IndianRupee, MapPin, CreditCard, Truck, Smartphone, Plus, CheckCircle2 } from 'lucide-react';
import { placeOrderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PAYMENT_OPTIONS = [
    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'card', label: 'Card', icon: CreditCard },
];

const buildSavedAddress = (user) => ({
    name: user?.user?.name || 'Shoppy User',
    email: user?.user?.email || 'user@shoppy.com',
    phone: String(user?.user?.phoneNumber || '9999999999'),
    street: user?.user?.address?.street || '',
    city: user?.user?.address?.city || '',
    state: user?.user?.address?.state || 'Kerala',
    pin: user?.user?.address?.pincode || '673001',
});

const emptyAddress = { name: '', email: '', phone: '', street: '', city: '', state: '', pin: '' };

const hasSavedAddress = (user) => {
    return !!(user?.user?.address?.street && user?.user?.address?.city);
};

export default function Checkout() {
    const { cart, cartTotal, clearCart, user } = useContext(AppContext);
    const navigate = useNavigate();

    const DELIVERY_FEE = cartTotal > 500 ? 0 : 49;
    const TAX = Math.round(cartTotal * 0.03);
    const grandTotal = cartTotal + DELIVERY_FEE + TAX;

    const savedAddress = buildSavedAddress(user);
    const hasProfile = hasSavedAddress(user);

    // 'saved' | 'new'
    const [addressMode, setAddressMode] = useState(hasProfile ? 'saved' : 'new');
    const [newForm, setNewForm] = useState(emptyAddress);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const activeForm = addressMode === 'saved' ? savedAddress : newForm;

    const handleChange = (e) => {
        setNewForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const validate = () => {
        if (addressMode === 'saved' && hasProfile) return {}; // saved address is already valid
        const errs = {};
        ['name', 'email', 'phone', 'street', 'city', 'state', 'pin'].forEach(field => {
            if (!newForm[field].trim()) errs[field] = 'Required';
        });
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.error('Please fill in all required address fields.');
            return;
        }
        if (cart.length === 0) { navigate('/'); return; }

        setLoading(true);
        try {
            const res = await placeOrderAPI(user.accessToken, {
                shippingAddress: {
                    name: activeForm.name,
                    email: activeForm.email,
                    phone: activeForm.phone,
                    street: activeForm.street,
                    city: activeForm.city,
                    state: activeForm.state,
                    pin: activeForm.pin,
                },
                paymentMethod,
            });

            if (res.success) {
                await clearCart();
                navigate('/order-success', { state: { order: res.order } });
            } else {
                toast.error(res.message || 'Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Checkout</h1>

            <form className={styles.layout} onSubmit={handleSubmit} noValidate>
                {/* ── Left: Form ── */}
                <div className={styles.formSection}>
                    {/* Shipping Address */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <MapPin size={18} className={styles.cardIcon} /> Shipping Address
                        </h2>

                        {/* Address mode tabs */}
                        {hasProfile && (
                            <div className={styles.addressTabs}>
                                <button
                                    type="button"
                                    className={`${styles.addrTab} ${addressMode === 'saved' ? styles.addrTabActive : ''}`}
                                    onClick={() => setAddressMode('saved')}
                                >
                                    <CheckCircle2 size={15} />
                                    Saved Address
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.addrTab} ${addressMode === 'new' ? styles.addrTabActive : ''}`}
                                    onClick={() => { setAddressMode('new'); setNewForm(emptyAddress); setErrors({}); }}
                                >
                                    <Plus size={15} />
                                    Different Address
                                </button>
                            </div>
                        )}

                        {/* Saved address preview card */}
                        {addressMode === 'saved' && hasProfile && (
                            <div className={styles.savedAddressCard}>
                                <div className={styles.savedAddressIcon}><MapPin size={16} /></div>
                                <div className={styles.savedAddressDetails}>
                                    <p className={styles.savedName}>{savedAddress.name}</p>
                                    <p className={styles.savedLine}>{savedAddress.street}</p>
                                    <p className={styles.savedLine}>{savedAddress.city}, {savedAddress.state} — {savedAddress.pin}</p>
                                    {savedAddress.phone && <p className={styles.savedLine}>📞 {savedAddress.phone}</p>}
                                </div>
                                <span className={styles.selectedBadge}>✓ Selected</span>
                            </div>
                        )}

                        {/* New address form */}
                        {addressMode === 'new' && (
                            <div className={styles.formGrid}>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Full Name</label>
                                    <input className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        name="name" value={newForm.name} onChange={handleChange} placeholder="John Doe" />
                                    {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Email</label>
                                    <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        name="email" type="email" value={newForm.email} onChange={handleChange} placeholder="you@example.com" />
                                    {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Phone</label>
                                    <input className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                                        name="phone" value={newForm.phone} onChange={handleChange} placeholder="9876543210" />
                                    {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                                </div>

                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Street Address</label>
                                    <input className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
                                        name="street" value={newForm.street} onChange={handleChange} placeholder="123 Main St" />
                                    {errors.street && <span className={styles.errMsg}>{errors.street}</span>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>City</label>
                                    <input className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                                        name="city" value={newForm.city} onChange={handleChange} placeholder="Calicut" />
                                    {errors.city && <span className={styles.errMsg}>{errors.city}</span>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>State</label>
                                    <input className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                                        name="state" value={newForm.state} onChange={handleChange} placeholder="Kerala" />
                                    {errors.state && <span className={styles.errMsg}>{errors.state}</span>}
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>PIN Code</label>
                                    <input className={`${styles.input} ${errors.pin ? styles.inputError : ''}`}
                                        name="pin" value={newForm.pin} onChange={handleChange} placeholder="673001" maxLength={6} />
                                    {errors.pin && <span className={styles.errMsg}>{errors.pin}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <CreditCard size={18} className={styles.cardIcon} /> Payment Method
                        </h2>
                        <div className={styles.paymentOptions}>
                            {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
                                <label key={id} className={`${styles.payOption} ${paymentMethod === id ? styles.paySelected : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={id}
                                        checked={paymentMethod === id}
                                        onChange={() => setPaymentMethod(id)}
                                        className={styles.radio}
                                    />
                                    <Icon size={20} />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right: Order Summary ── */}
                <div className={styles.summarySection}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Order Summary</h2>

                        <ul className={styles.orderItems}>
                            {cart.map((item) => {
                                const product = item.product;
                                if (!product) return null;
                                const price = product.offer || product.price;
                                return (
                                    <li key={product._id} className={styles.orderItem}>
                                        <img
                                            src={product.images?.[0] || 'https://placehold.co/50x50?text=img'}
                                            alt={product.title}
                                            className={styles.orderItemImg}
                                        />
                                        <span className={styles.orderItemName}>{product.title}</span>
                                        <span className={styles.orderItemQty}>×{item.qty}</span>
                                        <span className={styles.orderItemPrice}>
                                            <IndianRupee size={11} />{(price * item.qty).toLocaleString()}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className={styles.divider} />

                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}><span>Subtotal</span><span className={styles.amt}><IndianRupee size={12} />{cartTotal.toLocaleString()}</span></div>
                            <div className={styles.summaryRow}><span>Delivery</span><span className={DELIVERY_FEE === 0 ? styles.free : styles.amt}>{DELIVERY_FEE === 0 ? 'Free' : `₹${DELIVERY_FEE}`}</span></div>
                            <div className={styles.summaryRow}><span>GST (3%)</span><span className={styles.amt}><IndianRupee size={12} />{TAX.toLocaleString()}</span></div>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span className={styles.totalAmt}><IndianRupee size={15} />{grandTotal.toLocaleString()}</span>
                        </div>

                        <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
