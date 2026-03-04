import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import styles from './Profile.module.css'
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { myItems, refreshToken } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function Profile() {
  const { user, setUser } = useContext(AppContext);

  // useEffect(() => {
  //   const handleRefresh = async () => {
  //     if (!user?.accessToken) {
  //       try {
  //         const res = await refreshToken();

  //         if (res.success) {
  //           const updatedUser = {
  //             ...user,
  //             accessToken: res.accessToken
  //           };

  //           setUser(updatedUser);
  //           localStorage.setItem("user", JSON.stringify(updatedUser));
  //         }
  //       } catch (error) {
  //         console.log("Refresh failed:", error);
  //       }
  //     }
  //   };

  //   handleRefresh();
  // }, [user, setUser]);


  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await myItems(user.accessToken);
        if (res.success) {
          setProduct(res.products);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.accessToken) {
      fetchProduct();
    }
  }, [user]);
  
  return (
    <div className={styles.container}>
      <ProfileCard user={user} />

      <p className={styles.heading}>Your shared items <span>{product.length} items</span></p>
      <div className={styles.grid}>
        {product.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
          />
        ))}
      </div>
    </div>
  )
}
