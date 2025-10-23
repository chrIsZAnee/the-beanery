import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  // Show loading state while verifying authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#4a3520'
      }}>
        Loading...
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If authenticated but not admin, show access denied
  if (!user.isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <a href="/" style={{ 
          color: '#4a3520', 
          textDecoration: 'none',
          padding: '0.75rem 1.5rem',
          border: '2px solid #4a3520',
          borderRadius: '5px'
        }}>
          Go Home
        </a>
      </div>
    )
  }

  // User is authenticated and is admin
  return <>{children}</>
}

export default ProtectedRoute
