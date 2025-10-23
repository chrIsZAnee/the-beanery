import { useState } from 'react'
import './Menu.css'

interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  image: string
}

function Menu() {
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [rating, setRating] = useState('')
  const [comments, setComments] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const beverages: MenuItem[] = [
    {
      id: 1,
      name: 'Espresso',
      description: 'Rich and bold espresso shot with a velvety crema on top.',
      price: '₱150',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Chocolate',
      description: 'Sweet and rich flavorful Chocolate with coffee and whipped cream on top.',
      price: '₱280',
      image: 'https://images.pexels.com/photos/17506136/pexels-photo-17506136.jpeg'
    },
    {
      id: 3,
      name: 'Cappuccino',
      description: 'Perfectly balanced espresso with steamed milk and a thick foam layer.',
      price: '₱180',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Latte',
      description: 'Silky smooth blend of espresso and steamed milk with a touch of foam.',
      price: '₱170',
      image: 'https://images.pexels.com/photos/894696/pexels-photo-894696.jpeg'
    },
    {
      id: 5,
      name: 'Mocha',
      description: 'Chocolate and coffee come together with whipped cream on top.',
      price: '₱200',
      image: 'https://images.pexels.com/photos/33342687/pexels-photo-33342687.jpeg'
    },
    {
      id: 6,
      name: 'Macchiato',
      description: 'Espresso marked with a small amount of milk foam for a bold taste.',
      price: '₱160',
      image: 'https://images.pexels.com/photos/5211575/pexels-photo-5211575.jpeg'
    },
    {
      id: 7,
      name: 'Flat White',
      description: 'Velvety smooth coffee with microfoam milk and a strong espresso flavor.',
      price: '₱190',
      image: 'https://images.pexels.com/photos/3361170/pexels-photo-3361170.jpeg'
    },
    {
      id: 8,
      name: 'Affogato',
      description: 'Vanilla ice cream drowned in hot espresso for a sweet indulgence.',
      price: '₱220',
      image: 'https://images.pexels.com/photos/12914800/pexels-photo-12914800.jpeg'
    },
    {
      id: 9,
      name: 'Cold Brew',
      description: 'Slow-steeped coffee served cold for a refreshing smooth flavor.',
      price: '₱210',
      image: 'https://images.pexels.com/photos/4790062/pexels-photo-4790062.jpeg'
    }
  ]

  const pastries: MenuItem[] = [
    {
      id: 10,
      name: 'Chocolate Croissant',
      description: 'Flaky and buttery croissant filled with rich, melting chocolate.',
      price: '₱150',
      image: 'https://images.pexels.com/photos/29143163/pexels-photo-29143163.jpeg'
    },
    {
      id: 11,
      name: 'Lemon Cake',
      description: 'Refreshing lemon cake with a soft and spongy texture.',
      price: '₱180',
      image: 'https://images.pexels.com/photos/32865174/pexels-photo-32865174.jpeg'
    },
    {
      id: 12,
      name: 'Biscotti',
      description: 'Crunchy Italian biscuits perfect for dipping in coffee.',
      price: '₱120',
      image: 'https://images.pexels.com/photos/433120/pexels-photo-433120.jpeg'
    },
    {
      id: 13,
      name: 'Scone',
      description: 'Warm and crumbly scone with a light sweetness.',
      price: '₱140',
      image: 'https://images.pexels.com/photos/5419212/pexels-photo-5419212.jpeg'
    },
    {
      id: 14,
      name: 'Almond Biscotti',
      description: 'Crunchy almond-infused biscotti perfect for a quick snack.',
      price: '₱130',
      image: 'https://images.pexels.com/photos/776859/pexels-photo-776859.png'
    },
    {
      id: 15,
      name: 'Pound Cake',
      description: 'Deliciously moist cake with a hint of citrus flavor.',
      price: '₱160',
      image: 'https://images.pexels.com/photos/26383346/pexels-photo-26383346.jpeg'
    }
  ]

  const showOrderConfirmation = (item: string, price: string) => {
    setSelectedItem(item)
    setSelectedPrice(price)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const placeOrder = () => {
    alert(`Your order for ${selectedItem} has been placed!`)
    closeModal()
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Send feedback to backend API
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseInt(rating), comments })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFeedbackMsg(data.message)
        setRating('')
        setComments('')
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setFeedbackMsg('')
        }, 3000)
      } else {
        setFeedbackMsg(data.message || 'Failed to submit feedback. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setFeedbackMsg('Failed to connect to server. Please make sure the backend is running.')
    }
  }

  return (
    <>
      <section id="menu">
        <h3 className="section-title">Our Beverages</h3>
        <div className="menu">
          {beverages.map((item) => (
            <article 
              key={item.id} 
              className="menu-item" 
              onClick={() => showOrderConfirmation(item.name, item.price)}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className="price">{item.price}</div>
            </article>
          ))}
        </div>

        <h3 className="section-title">Our Pastries</h3>
        <div className="menu">
          {pastries.map((item) => (
            <article 
              key={item.id} 
              className="menu-item" 
              onClick={() => showOrderConfirmation(item.name, item.price)}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className="price">{item.price}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Modal for order confirmation */}
      {showModal && (
        <div id="orderModal" className="modal">
          <div className="modal-content">
            <h3 id="modalMessage">
              Do you want to order {selectedItem} for {selectedPrice}?
            </h3>
            <button className="confirm" onClick={placeOrder}>Yes, Order Now</button>
            <button className="cancel" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Feedback Form Section */}
      <section id="feedback">
        <h3 className="section-title">We'd Love Your Feedback!</h3>
        {feedbackMsg && (
          <div className={feedbackMsg.includes('Failed') ? 'error-message' : 'success-message'}>
            {feedbackMsg}
          </div>
        )}
        
        <form id="feedbackForm" onSubmit={handleFeedbackSubmit} style={{ marginTop: '10px' }}>
          <label htmlFor="rating">How would you rate our menu?</label><br />
          <select 
            id="rating" 
            name="rating" 
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select><br />
          
          <label htmlFor="comments">Any suggestions or comments?</label><br />
          <textarea 
            id="comments" 
            name="comments" 
            rows={4} 
            cols={50}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share your thoughts here..."
          /><br />
          
          <button type="submit">Submit Feedback</button>
        </form>
      </section>
    </>
  )
}

export default Menu

