import React, { useState, useEffect } from 'react'
import { recentItems } from '../../services/api';
import styles from './RecentItems.module.css'
import ProductCard from '../../components/ProductCard/ProductCard';


export default function RecentItems() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await recentItems(1, 10);

                if (res.success) {
                    setProducts(res.products || []);
                }

            } catch (error) {
                console.log("Fetch products error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);
    return (
        <div>
            <p className={styles.head}>
                Recent items <span>{products.length}</span>
            </p>
            <p className={styles.sub}>Explore newest products</p>
            <hr className={styles.seper} />

            {loading && <p>Loading...</p>}

            {!loading && products.length === 0 && (
                <p>No products available</p>
            )}

            <div className={styles.grid}>
                {products.map((item) => (
                    <ProductCard
                        key={item._id}
                        product={item}
                    />
                ))}
            </div>
        </div>
    )
}
