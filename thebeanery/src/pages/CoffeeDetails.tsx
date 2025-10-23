import { useParams, useNavigate } from 'react-router-dom'
import './CoffeeDetails.css'

function CoffeeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Coffee data (in real app, this would come from API or state)
  const coffeeData: { [key: string]: any } = {
    '1': {
      name: 'Cappuccino',
      description: 'A classic espresso-based drink with steamed milk and frothy foam.',
      price: '₱180',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      details: 'Our cappuccino is made with a perfect ratio of espresso, steamed milk, and milk foam. The foam is velvety and smooth, creating a luxurious drinking experience.',
      origin: 'Italian Classic',
      ingredients: ['Espresso (2 shots)', 'Steamed milk', 'Milk foam'],
      caffeine: 'Medium (150mg)',
      temperature: 'Hot',
      servingSize: '8 oz'
    },
    '2': {
      name: 'Latte',
      description: 'A smooth blend of espresso and steamed milk with a velvety texture.',
      price: '₱170',
      image: 'https://images.pexels.com/photos/894696/pexels-photo-894696.jpeg',
      details: 'Our latte features a generous amount of steamed milk with a single or double shot of espresso, topped with a small amount of foam for a silky finish.',
      origin: 'Italian Favorite',
      ingredients: ['Espresso (1-2 shots)', 'Steamed milk', 'Light foam'],
      caffeine: 'Medium (130mg)',
      temperature: 'Hot',
      servingSize: '12 oz'
    },
    '3': {
      name: 'Espresso',
      description: 'Strong, bold espresso shot for the coffee lovers who like it intense.',
      price: '₱150',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
      details: 'Pure, concentrated coffee made by forcing hot water through finely-ground coffee beans. Rich, intense, and full of flavor.',
      origin: 'Italian Heritage',
      ingredients: ['Finely ground coffee beans', 'Hot water'],
      caffeine: 'High (75mg per shot)',
      temperature: 'Hot',
      servingSize: '1-2 oz'
    }
  }

  const coffee = coffeeData[id || '1']

  if (!coffee) {
    return (
      <div className="coffee-not-found">
        <h2>Coffee not found</h2>
        <button onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    )
  }

  return (
    <>
      <section className="coffee-details-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="coffee-details-content">
          <div className="coffee-image-section">
            <img src={coffee.image} alt={coffee.name} />
          </div>

          <div className="coffee-info-section">
            <span className="coffee-origin">{coffee.origin}</span>
            <h1 className="coffee-name">{coffee.name}</h1>
            <p className="coffee-price">{coffee.price}</p>
            <p className="coffee-description">{coffee.description}</p>
            <p className="coffee-details">{coffee.details}</p>

            <div className="coffee-specs">
              <div className="spec-item">
                <h4>Ingredients</h4>
                <ul>
                  {coffee.ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="spec-grid">
                <div className="spec-item">
                  <h4>Caffeine</h4>
                  <p>{coffee.caffeine}</p>
                </div>
                <div className="spec-item">
                  <h4>Temperature</h4>
                  <p>{coffee.temperature}</p>
                </div>
                <div className="spec-item">
                  <h4>Serving Size</h4>
                  <p>{coffee.servingSize}</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="order-btn" onClick={() => alert('Order placed!')}>
                Order Now
              </button>
              <button className="menu-btn" onClick={() => navigate('/menu')}>
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer>
        &copy; 2025 The Beanery. All rights reserved.
      </footer>
    </>
  )
}

export default CoffeeDetails


