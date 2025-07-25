import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import Loader from './components/Loader'

export default function RedirectPage() {
  const { slug } = useParams()

  useEffect(() => {
    const fetchAndRedirect = async () => {
      const docRef = doc(db, 'short_urls', slug)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { original } = docSnap.data()
        window.location.href = original // ✅ redirect
      } else {
        alert('Invalid or expired short link.')
      }
    }
    fetchAndRedirect()
  }, [slug])

  return (
    <div className="p-8 text-center text-xl font-bold text-accent">
      <Loader/>
    </div>
  )
}
