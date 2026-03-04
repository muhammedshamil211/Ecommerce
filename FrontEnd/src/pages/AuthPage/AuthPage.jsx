import React, { useState, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import { AppContext } from '../../context/AppContext'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useContext(AppContext)
  const [authView, setAuthView] = useState(searchParams.get('view') || 'login')

  // Redirect if already logged in
  if (user) {
    navigate('/')
  }

  const handleAuthSuccess = () => {
    navigate('/')
  }

  return (
    <div className="auth-container">
      {authView === 'login' ? (
        <Login 
          onSuccess={handleAuthSuccess} 
          setAuthView={() => setAuthView('signup')} 
        />
      ) : (
        <Signup 
          onSuccess={handleAuthSuccess} 
          setAuthView={() => setAuthView('login')} 
        />
      )}
    </div>
  )
}
