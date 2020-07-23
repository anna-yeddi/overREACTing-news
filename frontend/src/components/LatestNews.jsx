import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function LatestNews(props) {
  const [news, setNews] = useState([])
  // API Helpers
  const [isLoading, setLoading] = useState(false)
  const [hasError, setError] = useState(null)

  // create empty ref to evaluate which response was the latest
  const timestampRef = useRef()

  // Create effect to se up interval for API calls
  useEffect(() => {
    const fetchNews = async () => {
      // Assign global ref to the current timestamp
      // This timestamp will be kept in the closure of response
      const timestamp = Date.now()
      timestampRef.current = timestamp
      // Set loader
      setLoading(true)

      // Fetch news from server / REST API
      try {
        const response = await fetch(process.env.REACT_APP_NEWS_URL)
        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const news = await response.json()

        // Check if timestamp of response = current ref to update state
        if (timestampRef.current === timestamp) {
          setNews(news)
        }

        // If successful
        setError(null)
      } catch (e) {
        // console.error(e)
        setError(e)
      } finally {
        // Remove loader in any outcome
        setLoading(false)
      }
    }

    // call the fetch on initial render
    fetchNews()

    // Set interval for fetching updates from REST API every 5 sec
    const intervalId = setInterval(fetchNews, 5 * 1000)

    // Return will be triggered on Unmounting
    return () => {
      clearInterval(intervalId)
    }

    // IF no input/dependencies to trigger the effect once per each render
    // Empty array will ensure the effect will only run once (depends on nothing)
  }, [])

  console.log('Return me now', news)

  // Conditional rendering
  return (
    <>
      {isLoading && <p>Loading...</p>}
      <ul>
        {news.map((o) => (
          <li key={o.id}>
            #{o.id} {o.content}
          </li>
        ))}
      </ul>
    </>
  )
}

LatestNews.propTypes = {}

export default LatestNews
