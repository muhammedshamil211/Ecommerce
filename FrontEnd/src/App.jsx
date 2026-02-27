import React, { useContext, useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer'
import Home from './pages/Home/Home'
import About from './pages/About'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { AppContext } from './context/AppContext'


export default function App() {
  const { user, setUser } = useContext(AppContext)
  const [showAuth, setShowAuth] = useState(false)
  const [authView, setAuthView] = useState('login')

 const handleProfileClick = () => {
  if (!user) {
    setAuthView('login')
    setShowAuth(true)
  }
}


  const handleAuthSuccess = () => {
    setShowAuth(false)
    setAuthView('login')
  }

  return (
    <div className="app-root">
      <Header onProfileClick={handleProfileClick} user={user} />
      <main className="container">
        {showAuth ? (
          authView === 'login' ? (
            <Login onSuccess={handleAuthSuccess} setAuthView={()=>setAuthView("signup")} />
          ) : (
            <Signup onSuccess={handleAuthSuccess} setAuthView={()=>setAuthView("login")}/>
          )
        ) : (
          <>
            <Home />
            <About />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
