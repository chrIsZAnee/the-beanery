import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Menu from './Menu'
import About from './About'
import Contact from './Contact'
import Gallery from './pages/Gallery'
import CoffeeDetails from './pages/CoffeeDetails'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
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
  )
}

export default App
