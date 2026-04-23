import React, { useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer'
import styles from './Layout.module.css'
import { AppContext } from '../context/AppContext'
import { Plus } from 'lucide-react'

export default function Layout() {
    const { user } = useContext(AppContext)
    const navigate = useNavigate();

    const location = useLocation();
    console.log(location?.pathname);

    return (
        <div className={styles.layoutContainer}>
            <Header user={user} />
            {location?.pathname !== ("/addItems" || "/login" || "signup") && user && (
                <div
                    className={styles.add}
                    onClick={() => navigate("/addItems")}
                >
                    <Plus className={styles.icon} size={22} />
                    <span className={styles.text}>Add Item</span>
                </div>
            )}


            <main className={styles.mainContent}>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
