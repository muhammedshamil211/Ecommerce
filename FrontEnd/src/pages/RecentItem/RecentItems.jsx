import React, { useState, useEffect } from 'react'
import { recentItems } from './api'
import styles from './RecentItems.module.css'
import ProductGrid from '../../components/ProductGrid/ProductGrid'

export default function RecentItems() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const fetchProducts = async (pageNumber = 1) => {

        try {

            setLoading(true)

            const res = await recentItems(pageNumber, 10)

            if (res.success) {

                setProducts(prev =>
                    pageNumber === 1
                        ? res.products
                        : [...prev, ...res.products]
                )

                setTotalPage(res.totalPage)

            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchProducts(1)
    }, [])

    const loadMore = () => {

        const nextPage = page + 1
        setPage(nextPage)
        fetchProducts(nextPage)

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

            {page < totalPage && (

                <div className={styles.moreContainer}>
                    <span
                        className={styles.more}
                        onClick={loadMore}
                    >
                        More →
                    </span>
                </div>

            )}

        </div>
    )
}