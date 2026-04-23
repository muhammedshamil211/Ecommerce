import ProductCard, { ProductCardSkeleton } from '../ProductCard/ProductCard'
import styles from './ProductGrid.module.css'

export default function ProductGrid({ products, loading, count = 8 }) {
    return (
        <div className={styles.grid}>
            {loading ? (
                // Render skeletons if loading
                Array.from({ length: count }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                ))
            ) : (
                products.map((item) => (
                    <ProductCard
                        key={item._id}
                        product={item}
                    />
                ))
            )}
        </div>
    )
}
