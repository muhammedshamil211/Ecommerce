import React, { useState, useContext } from 'react'
import styles from './Signup.module.css'
import { AppContext } from '../../context/AppContext'
import { signup } from '../../services/api'
import CloseButton from '../../components/closeButton/CloseButton'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup({ onSuccess, setAuthView }) {
    const { setUser } = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault()
        if (!name || !email || !password) return setError('Please fill all fields')
        setError(null)
        setLoading(true)
        try {
            const userData = await signup({ name, email, password })
            setUser(userData)
            setLoading(false)
            navigate(-1);
        } catch (err) {
            setLoading(false)
            setError(err.msg || err.message || 'Signup failed')
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} aria-label="signup form">
                <h2 className={styles.title}>Create account</h2>
                <CloseButton
                    onClick={() => navigate(-2)}
                    variant='dark'
                />
                {error && <div className={styles.error}>{error}</div>}

                <label className={styles.label} htmlFor="signup-name">Name</label>
                <input
                    id="signup-name"
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <label className={styles.label} htmlFor="signup-email">Email</label>
                <input
                    id="signup-email"
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label className={styles.label} htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Creating…' : 'Create account'}
                </button>

                <div className={styles.switchRow}>
                    Already have an account?
                    <Link to="/login">Sign in</Link>
                </div>
            </form>
        </div>
    )
}
