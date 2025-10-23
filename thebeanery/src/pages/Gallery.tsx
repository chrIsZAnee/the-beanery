import './Gallery.css'

function Gallery() {
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      title: 'Fresh Coffee Beans',
      category: 'Ingredients'
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg',
      title: 'Barista at Work',
      category: 'Our Team'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg',
      title: 'Cozy Interior',
      category: 'Ambiance'
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
      title: 'Latte Art',
      category: 'Our Craft'
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
      title: 'Coffee Selection',
      category: 'Menu'
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg',
      title: 'Morning Brew',
      category: 'Experience'
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
      title: 'Pastry Display',
      category: 'Menu'
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg',
      title: 'Coffee Break',
      category: 'Experience'
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/34085/pexels-photo.jpg',
      title: 'Espresso Shot',
      category: 'Our Craft'
    }
  ]

  return (
    <>
      <section className="gallery-hero">
        <h2>Our Gallery</h2>
        <p>Explore the moments that make The Beanery special</p>
      </section>

      <section className="gallery-grid">
        {galleryImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.url} alt={image.title} />
            <div className="gallery-overlay">
              <span className="gallery-category">{image.category}</span>
              <h3 className="gallery-title">{image.title}</h3>
            </div>
          </div>
        ))}
      </section>

      <footer>
        &copy; 2025 The Beanery. All rights reserved.
      </footer>
    </>
  )
}

export default Gallery


