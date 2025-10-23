import { useNavigate } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
        <p className="not-found-text">
          Looks like this coffee blend doesn't exist in our menu. 
          Let's get you back to something delicious!
        </p>
        <div className="not-found-buttons">
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
          <button 
            onClick={() => navigate('/menu')}
            className="btn-secondary"
          >
            View Menu
          </button>
        </div>
        <div className="coffee-cup">☕</div>
      </div>
    </div>
  )
}

export default NotFound


