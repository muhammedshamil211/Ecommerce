import React from 'react'
import styles from './Home.module.css'
import landing from '../../assets/landing.png'
import AllItems from '../AllItems/AllItems'
import RecentItems from '../RecentItem/RecentItems'
import MostViewItems from '../MostView/MostViewItems'

export default function Home() {
  return (
    <section id="home" className={styles.main}>
      {/* <div className={styles.imageDiv}>
        <img src={landing} alt="" />
      </div> */}
      {/* <hr /> */}
      <AllItems />
      <RecentItems />
      <MostViewItems />
    </section>
  )
}
