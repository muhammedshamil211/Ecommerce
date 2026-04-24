
import React, { useContext, useEffect, useState } from 'react'
import styles from './Additem.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { addItems, fetchProductData, updateItem } from './api';
import Alert from '../../components/UI/Alert/Alert';

export default function AddItems() {
    const navigate = useNavigate();

    const { id } = useParams();
    const isEditMode = !!id;
    const { user } = useContext(AppContext);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        offer: '',
        category: "electronics",
        images: '',
        stock: 10
    });

    useEffect(() => {
        if (isEditMode) {
            const loadProduct = async () => {
                try {
                    setLoading(true);
                    const res = await fetchProductData(id);

                    if (res.success && res.product) {
                        const product = res.product;
                        setFormData({
                            title: product.title,
                            description: product.description || '',
                            price: product.price || '',
                            offer: product.offer || '',
                            category: product.category || 'electronics',
                            images: Array.isArray(product.images) ? product.images.join('---,') : "",
                            stock: product.stock || 10
                        });
                    }
                } catch (error) {
                    setError("fail to fetch product data");
                } finally {
                    setLoading(false)
                }
            }
            loadProduct()
        } else {
            setFormData({
                title: "",
                description: "",
                price: "",
                offer: '',
                category: "electronics",
                images: '',
                stock: 10
            })
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true)
        setError(null);

        try {
            const imagesArray = typeof formData.images === 'string' && formData.images.trim() !== ''
                ? formData.images.split(',-,').map(url => url.trim()).filter(url => url)
                : [];

            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                images: imagesArray,
                price: Number(formData.price),
                offer: Number(formData.offer),
                stock: Number(formData.stock)
            }

            if (isEditMode) {
                await updateItem(user.accessToken, payload, id);
            } else {
                await addItems(user.accessToken, payload);
            }
            setSubmitting(false);
            navigate("/profile");

        } catch (error) {
            console.log(error);
            setError(error);
        }
    }
    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <h2>{isEditMode ? 'Edit Item' : 'Add New Item'}</h2>
                <p>{isEditMode ? 'Update your product details' : 'Share something new with the community'}</p>
            </div>

            {error && <Alert variant="error">{error.message || error}</Alert>}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        required
                        placeholder="E.g., Vintage Leather Jacket"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Garden</option>
                        <option value="sports">Sports</option>
                        <option value="toys">Toys</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="images">Image URLs (,-, please add this in between URLs)</label>
                    <input
                        type="text"
                        id="images"
                        name="images"
                        value={formData.images}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label htmlFor='price'>Price</label>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            placeholder='1000'
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor='offer'>Offer</label>
                        <input
                            type='number'
                            id='offer'
                            name='offer'
                            placeholder='5'
                            value={formData.offer}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor='stock'>Stock</label>
                        <input
                            type='number'
                            id='stock'
                            name='stock'
                            placeholder='100'
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        required
                        placeholder="Describe your item in detail..."
                        rows="5"
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        disabled={submitting}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : isEditMode ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </form>
        </div>
    )
}
