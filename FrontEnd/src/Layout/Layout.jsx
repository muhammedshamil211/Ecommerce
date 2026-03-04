import React, { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer'
import styles from './Layout.module.css'
import { AppContext } from '../context/AppContext'
import { PlusCircle, PlusCircleIcon, PlusIcon } from 'lucide-react'

export default function Layout() {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    return (
        <div className={styles.layoutContainer}>
            <Header user={user} />
            <div
                className={styles.add}
                onClick={() => navigate("/addItems")}
            >
                <PlusCircleIcon size={44} />
            </div>

            <main className={styles.mainContent}>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
