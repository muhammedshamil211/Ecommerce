import React, { useState, useContext } from 'react'
import styles from './Login.module.css'
import { AppContext } from '../../context/AppContext'
import { login } from '../../services/api'
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
            const userData = await login({ email, password })

            if (!userData.success) {
                const text = await userData.text();
                throw new error(text);
            }
            setUser({user:userData.user,token:userData.accessToken})
            setLoading(false)
            localStorage.setItem("user", JSON.stringify({user:userData.user,token:userData.accessToken}));
            const from = location.state?.from || "/";
            navigate(from, { replace: true });
            // if (onSuccess) onSuccess(userData)
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
