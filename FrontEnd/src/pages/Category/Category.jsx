import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styles from './Category.module.css'
import { categoryItem } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductGrid from '../../components/ProductGrid/ProductGrid';

export default function Category() {

    const { category } = useParams();
    console.log(category);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await categoryItem(category, 1, 6);

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

    }, [category]);
    return (
        <div>
            <p className={styles.head}>
                {category.charAt(0).toUpperCase() + category.slice(1)} items <span>{products.length}</span>
            </p>
            <p className={styles.sub}>Explore newest products</p>
            <hr className={styles.seper} />

            {!loading && products.length === 0 && (
                <div className={styles.noProducts}>No products available</div>
            )}
            <ProductGrid
                products={products}
                loading={loading}
            />
        </div>
    )
}
