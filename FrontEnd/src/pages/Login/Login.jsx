import React, { useState, useContext } from 'react'
import styles from './Login.module.css'
import { AppContext } from '../../context/AppContext'
import { login } from './api'
import CloseButton from '../../components/closeButton/CloseButton'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login({ onSuccess, setAuthView }) {
    const { setUser } = useContext(AppContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async e => {
        e.preventDefault()
        if (!email || !password) return setError('Please provide email and password')
        setError(null)
        setLoading(true)
        try {
            const data = await login({ email, password })
            
            // apiClient throws on !ok, so if we're here, it was successful
            const sessionData = { user: data.user, accessToken: data.accessToken };
            setUser(sessionData)
            localStorage.setItem("user", JSON.stringify(sessionData));
            
            const from = location.state?.from || "/";
            navigate(from, { replace: true });
        } catch (err) {
            setLoading(false)
            setError(err.message || 'Login failed')
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} aria-label="login form">
                <h2 className={styles.title}>Sign in</h2>
                <CloseButton
                    onClick={() => navigate(-1)}
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
                    <Link to="/signup">Create an account</Link>
                </div>
            </form>
        </div>
    )
}
