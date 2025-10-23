import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const userConfirmed = window.confirm("Are you sure you want to send this message?")
    
    if (userConfirmed) {
      // Create mailto link with form data
      const subject = `Message from ${formData.name}`
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      const mailtoLink = `mailto:contact@thebeanery.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Open mail client
      window.location.href = mailtoLink
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <section id="contact">
        <div>
          <h3 className="section-title">Contact</h3>
          <p>
            Have questions or want to order? Reach out to us at{' '}
            <a href="mailto:contact@thebeanery.com">contact@thebeanery.com</a>
            {' '}or call us at <strong>(555) 123-4567</strong>.
          </p>

          <form id="contactForm" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <textarea 
              name="message" 
              rows={5} 
              placeholder="Your Message or Recommendation"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>

        <img 
          id="contact-image" 
          src="https://images.pexels.com/photos/2193600/pexels-photo-2193600.jpeg" 
          alt="Coffee Beans or Shop" 
        />
      </section>
    </>
  )
}

export default Contact

