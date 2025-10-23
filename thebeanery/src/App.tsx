import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Menu from './Menu'
import About from './About'
import Contact from './Contact'
import Gallery from './pages/Gallery'
import CoffeeDetails from './pages/CoffeeDetails'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Layout with Header - Nested Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            
            {/* Dynamic Route - Coffee Details */}
            <Route path="coffee/:id" element={<CoffeeDetails />} />
          </Route>

          {/* Auth Routes - No Header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route - Admin Dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Admin />} />
          </Route>

          {/* 404 Not Found - Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
