import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import styles from './Profile.module.css'
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { myItems, refreshToken } from '../../services/api';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AppContext);
  const productectionRef = useRef(null);
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [key, setKey] = useState('');

  const scrollProduct = () => {
    productectionRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const fetchProduct = async () => {
    try {
      let res;
      if (key) {
        res = await myItems(user.accessToken, key);
      } else {
        res = await myItems(user.accessToken);
      }
      if (res.success) {
        setProduct(res.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchProduct();
    }
  }, [user]);

  return (
    <div className={styles.container1}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to listings
      </button>
      <ProfileCard user={user} length={product.length} scrollToProduct={scrollProduct} />
      {product.length > 0 && (
        <div>
          <p className={styles.heading} ref={productectionRef}>Your shared items <span>{product.length} items</span></p>
          <div className={styles.search}>
            <input id="site-search" type="text" placeholder="Search for products, brands and more..." onChange={(e) => setKey(e.target.value)} />
            <button type="button" aria-label="Search" className={styles.searchButton} onClick={fetchProduct}>
              <Search size={18} />
            </button>
          </div>
          <ProductGrid
            products={product}
          />
        </div>
      )}
    </div>
  )
}
