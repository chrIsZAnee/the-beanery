import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import { API_URL } from '../config'

function Admin() {
  const navigate = useNavigate()
  const [feedbackList, setFeedbackList] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
    fetchStats()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback`)
      const data = await response.json()
      if (data.success) {
        setFeedbackList(data.feedback)
      }
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback/stats`)
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating)
  }

  return (
    <>
      <section className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Back to Home
          </button>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Feedback</h3>
              <p className="stat-number">{stats.total_feedback}</p>
            </div>
            <div className="stat-card">
              <h3>Average Rating</h3>
              <p className="stat-number">{parseFloat(stats.average_rating).toFixed(1)} ⭐</p>
            </div>
            <div className="stat-card">
              <h3>Highest Rating</h3>
              <p className="stat-number">{stats.highest_rating} ⭐</p>
            </div>
            <div className="stat-card">
              <h3>Lowest Rating</h3>
              <p className="stat-number">{stats.lowest_rating} ⭐</p>
            </div>
          </div>
        )}

        <div className="feedback-section">
          <h2>Customer Feedback</h2>
          {loading ? (
            <p className="loading-text">Loading feedback...</p>
          ) : feedbackList.length === 0 ? (
            <p className="no-feedback">No feedback available yet.</p>
          ) : (
            <div className="feedback-list">
              {feedbackList.map((feedback) => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-rating">{getRatingStars(feedback.rating)}</span>
                    <span className="feedback-id">ID: #{feedback.id}</span>
                  </div>
                  <p className="feedback-comment">{feedback.comments || 'No comment provided'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        &copy; 2025 The Beanery. All rights reserved.
      </footer>
    </>
  )
}

export default Admin


