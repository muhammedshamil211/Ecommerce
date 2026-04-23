import React from 'react'
import styles from './Home.module.css'
import landing from '../../assets/landing.png'
import AllItems from '../AllItems/AllItems'
import RecentItems from '../RecentItem/RecentItems'
import MostViewItems from '../MostView/MostViewItems'

export default function Home() {
  return (
    <div className={styles.main}>
      <AllItems />
      <RecentItems />
      <MostViewItems />
    </div>
  )
}
