import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header>
      <h1>The Beanery</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/gallery">Gallery</Link>
        
        {user && user.isAdmin && (
          <Link to="/admin" className="admin-link">Admin</Link>
        )}
      </nav>
      
      <div className="auth-section">
        {user ? (
          <div className="user-menu">
            <span className="username">👤 {user.username}</span>
            {user.isAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header


