import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import styles from './WishList.module.css'
import { getWishList } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishList() {
    const { user } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { wishlist, setWishlist } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {

        const loadWishlist = async () => {
            try {
                setLoading(true);
                const res = await getWishList(user.accessToken);
                console.log(res);
                setProducts(res.products);
                setWishlist(res.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();

    }, [user]);

    if (wishlist.length === 0) {
        return (
            <div className={styles.emptyPage}>
                <ShoppingBag size={72} strokeWidth={1.2} className={styles.emptyIcon} />
                <h2>Your wishlist is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <button className={styles.shopBtn} onClick={() => navigate('/')}>
                    Start Shopping
                </button>
            </div>
        )
    }
    return (
        <div>
            <p className={styles.head}>
                Your wishlist <span>{products.length}</span>
            </p>
            <p className={styles.sub}>Explore newest products</p>
            <hr className={styles.seper} />

            <ProductGrid
                products={products}
                loading={loading}
            />
        </div>
    )
}
