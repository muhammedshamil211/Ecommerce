import React, { useContext} from 'react'
import styles from './AllItems.module.css'
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { AppContext } from '../../context/AppContext';

export default function AllItems() {

    const { allProduct,loading } = useContext(AppContext);
    console.log(allProduct);

    return (
        <div className={styles.containe}>

            <p className={styles.head}>
                All items <span>{allProduct.length}</span>
            </p>
            <p className={styles.sub}>Explore all products</p>
            <hr className={styles.seper} />

            {!loading && allProduct.length === 0 && (
                <div className={styles.noProducts}>No products available</div>
            )}
            
            <ProductGrid
                products={allProduct}
                loading={loading}
            />
        </div>
    )
}