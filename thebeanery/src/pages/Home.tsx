import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [selectedCoffee, setSelectedCoffee] = useState('espresso')
  const [pairingResult, setPairingResult] = useState('')

  const bestSellers = [
    {
      id: 1,
      name: 'Cappuccino',
      description: 'A classic espresso-based drink with steamed milk and frothy foam.',
      price: '₱180',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Latte',
      description: 'A smooth blend of espresso and steamed milk with a velvety texture.',
      price: '₱170',
      image: 'https://images.pexels.com/photos/894696/pexels-photo-894696.jpeg'
    },
    {
      id: 3,
      name: 'Espresso',
      description: 'Strong, bold espresso shot for the coffee lovers who like it intense.',
      price: '₱150',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
    }
  ]

  const coffeeOptions = [
    { value: 'espresso', label: 'Espresso' },
    { value: 'latte', label: 'Latte' },
    { value: 'choco', label: 'Chocolate' },
    { value: 'mocha', label: 'Mocha' },
    { value: 'macchiato', label: 'Macchiato' },
    { value: 'coldbrew', label: 'Cold Brew' },
    { value: 'flatwhite', label: 'Flat White' },
    { value: 'affo', label: 'Affogato' }
  ]

  const showPairing = () => {
    let pairing: string

    switch(selectedCoffee) {
      case 'espresso':
        pairing = 'Try it with a chocolate croissant for the ultimate treat!'
        break
      case 'latte':
        pairing = 'A slice of lemon cake goes perfectly with a latte.'
        break
      case 'choco':
        pairing = 'Pair it with a warm scone to balance the rich chocolate flavor.'
        break
      case 'mocha':
        pairing = 'A chocolate chip muffin is the perfect complement to a mocha.'
        break
      case 'macchiato':
        pairing = 'Macchiatos pair beautifully with a sweet almond biscotti.'
        break
      case 'coldbrew':
        pairing = 'Cold brew is best enjoyed with a tangy citrus pound cake.'
        break
      case 'flatwhite':
        pairing = 'Flat whites go wonderfully with a buttery croissant.'
        break
      case 'affo':
        pairing = 'Affogato pairs perfectly with a crisp, light biscotti.'
        break
      default:
        pairing = 'Select a coffee to get the perfect pairing suggestion!'
        break
    }

    setPairingResult(pairing)
  }

  const handleViewMenu = () => {
    navigate('/menu')
  }

  return (
    <>
      <section className="hero">
        <h2>Welcome to The Beanery</h2>
        <p>Your cozy neighborhood coffee haven. Freshly brewed happiness in every cup.</p>
      </section>

      <section className="header">
        <h2>The Best Sellers</h2>
      </section>

      <section className="best-sellers">
        {bestSellers.map((item) => (
          <div 
            key={item.id} 
            className="best-seller"
            onClick={() => navigate(`/coffee/${item.id}`)}
          >
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="price">{item.price}</span>
          </div>
        ))}
      </section>

      <section className="coffee-pairing">
        <h3>Find Your Perfect Coffee Pairing</h3>
        <label htmlFor="coffee-type">Choose a coffee:</label>
        <select 
          id="coffee-type" 
          name="coffee-type"
          value={selectedCoffee}
          onChange={(e) => setSelectedCoffee(e.target.value)}
        >
          {coffeeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={showPairing}>Get Pairing Suggestions</button>
        <div id="pairing-result" className="pairing-result">
          {pairingResult && <p>{pairingResult}</p>}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
          onClick={handleViewMenu}
          className="view-menu-btn"
        >
          View Full Menu
        </button>
      </div>

      <footer>
        &copy; 2025 The Beanery. All rights reserved.
      </footer>
    </>
  )
}

export default Home


