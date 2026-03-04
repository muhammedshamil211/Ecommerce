import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import styles from './WishList.module.css'
import { getWishList } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function WishList() {
    const { user } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const loadWishlist = async () => {
            try {
                setLoading(true);
                const res = await getWishList(user.accessToken);
                console.log(res);
                setProducts(res.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();

    }, [user]);
    return (
        <div>
            <p className={styles.head}>
                Your wishlist <span>{products.length}</span>
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
