import React from 'react'
import styles from './Home.module.css'
import landing from '../../assets/landing.png'

export default function Home() {
  return (
    <section id="home" className={styles.main}>
      <div className={styles.imageDiv}>
        <img src={landing} alt="" />
      </div>
    </section>
  )
}
