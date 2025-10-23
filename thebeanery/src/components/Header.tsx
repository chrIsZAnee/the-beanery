import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header>
      <h1>The Beanery</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
    </header>
  )
}

export default Header


