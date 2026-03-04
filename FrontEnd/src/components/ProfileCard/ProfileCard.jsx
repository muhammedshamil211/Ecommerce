import React from 'react'
import styles from './ProfileCard.module.css'

export default function ProfileCard({user}) {
    return (
        <div>
            <div className={styles.profile}>
                <div className={styles.details}>
                    <div className={styles.profilePic}>
                        {user.user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <div>
                            <label htmlFor="name">name: </label>
                            <input type="text" value={user.user.name} />
                        </div>
                        <div>
                            <label htmlFor="name">Phone: </label>
                            <input type="text" value="+91 9995199985" />
                        </div>
                        <div>
                            <label htmlFor="name">Total Items: </label>
                            <input type="text" value="4" />
                        </div>
                    </div>

                </div>

                <div className={styles.action}>
                    <button>Edit Profile</button>
                </div>

            </div>
        </div>
    )
}
