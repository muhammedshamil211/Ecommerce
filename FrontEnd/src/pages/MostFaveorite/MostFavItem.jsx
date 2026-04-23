import React, { useState, useEffect, useContext } from 'react'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import { AppContext } from '../../context/AppContext'
import { allItems } from '../../services/api';
import styles from './MostFavItem.module.css';

export default function MostFavItem() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { allProduct } = useContext(AppContext);

    const mostLiked = async () => {
        try {
            const prod = allProduct.filter((item) => item.likes.length > 0).sort((a, b) => b.likes.length - a.likes.length);
}
    }

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
