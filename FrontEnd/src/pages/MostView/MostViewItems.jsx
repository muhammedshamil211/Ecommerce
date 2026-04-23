import React, { useState,useEffect } from 'react'
import { mostViewedItems } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './MostViewItems.module.css'
import ProductGrid from '../../components/ProductGrid/ProductGrid';

export default function MostViewItems() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await mostViewedItems(1, 10);

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
                Most viewed items <span>{products.length}</span>
            </p>
            <p className={styles.sub}>Explore recommended products</p>
            <hr className={styles.seper} />

            {!loading && products.length === 0 && (
                <div className={styles.noProducts}>No products available</div>
            )}

            <ProductGrid
                products={products}
                loading={loading}
                count={4}
            />
        </div>
    )
}
