import React, { useState, useEffect, useContext } from 'react'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { AppContext } from '../../context/AppContext'
import { getMostLiked } from './api';
import styles from './MostFavItem.module.css';

export default function MostFavItem() {
    const { allProduct, loading } = useContext(AppContext);
    const products = getMostLiked(allProduct).slice(0, 4);


return (
    <div>

        <p className={styles.head}>
            Recent items <span>{products.length}</span>
        </p>

        <p className={styles.sub}>
            Explore newest products
        </p>

        <hr className={styles.seper} />

        <ProductGrid products={products} loading={loading && products.length === 0} count={4} />

    </div>
)
}
