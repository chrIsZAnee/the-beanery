import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    // For demo purposes, we'll use localStorage
    const auth = localStorage.getItem('isAdminAuthenticated')
    setIsAuthenticated(auth === 'true')
  }, [])

  if (isAuthenticated === null) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
  }

  if (!isAuthenticated) {
    // Show login prompt
    const password = prompt('Enter admin password:')
    if (password === 'admin123') {
      localStorage.setItem('isAdminAuthenticated', 'true')
      setIsAuthenticated(true)
      return <>{children}</>
    } else {
      alert('Incorrect password! Redirecting to home...')
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute


