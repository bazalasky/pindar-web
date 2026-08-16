import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(import.meta.env.VITE_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP network error! Status: ${response.status}`);
        }

        const result = await response.text();
        setContent(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading records...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <>
      <div>{content}</div>
    </>
  )
}

export default App
