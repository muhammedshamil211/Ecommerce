import React, { useEffect, useState } from 'react'
import { allItems } from '../../services/api';
import styles from './AllItems.module.css'
import ProductCard from '../../components/ProductCard/ProductCard';

export default function AllItems() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await allItems();

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
        <div className={styles.containe}>

            <p className={styles.head}>
                All items <span>{products.length}</span>
            </p>
            <p className={styles.sub}>Explore all products</p>
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