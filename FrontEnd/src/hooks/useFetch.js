import { useState, useEffect } from 'react'

export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(url)
      .then((r) => r.json())
      .then((json) => mounted && setData(json))
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [url])

  return { data, loading, error }
}
