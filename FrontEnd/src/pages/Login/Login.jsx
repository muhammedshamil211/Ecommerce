import React, { useState, useContext } from 'react'
import styles from './Login.module.css'
import { AppContext } from '../../context/AppContext'
import { login } from '../../services/api'
import CloseButton from '../../components/closeButton/CloseButton'

export default function Login({ onSuccess, setAuthView }) {
    const { setUser } = useContext(AppContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        if (!email || !password) return setError('Please provide email and password')
        setError(null)
        setLoading(true)
        try {
            const userData = await login({ email, password })
            setUser(userData)
            setLoading(false)
            if (onSuccess) onSuccess(userData)
        } catch (err) {
            setLoading(false)
            setError(err.message || 'Login failed')
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} aria-label="login form">
                <h2 className={styles.title}>Sign in</h2>
                <CloseButton    
                    onClick={onSuccess}
                    variant='dark'
                />
                {error && <div className={styles.error}>{error}</div>}

                <label className={styles.label} htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label className={styles.label} htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <div className={styles.switchRow}>
                    Don't have an account?
                    <span onClick={setAuthView}>Create an account</span>
                </div>
            </form>
        </div>
    )
}
