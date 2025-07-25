// src/components/URLShortener.jsx
import { useState, useRef, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { WhatsappShareButton, EmailShareButton, TwitterShareButton } from 'react-share'
import Loader from './Loader'
import gsap from 'gsap'

export default function URLShortener() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const base = window.location.origin + '/'
  const shareUrl = shortUrl
  const shareText = "Check out this secure link:"

  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  const shorten = async () => {
    if (!url.trim() || !slug.trim()) {
      alert('Please enter both a URL and a slug')
      return
    }

    setIsLoading(true)
    const slugDoc = doc(db, 'short_urls', slug)
    const existing = await getDoc(slugDoc)

    if (existing.exists()) {
      setIsLoading(false)
      alert('❌ Slug already taken. Try another one.')
      return
    }

    await setDoc(slugDoc, {
      slug,
      original: url,
      createdAt: serverTimestamp()
    })

    setShortUrl(`${base}${slug}`)
    setIsLoading(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl)
    alert('✅ Short link copied!')
  }

  return (
    <div ref={ref} className="space-y-6">
      <h2 className="text-xl font-semibold text-accent">🔗 URL Shortener</h2>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter long URL..."
        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent"
      />

      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value.trim())}
        placeholder="Enter custom slug (e.g. my-link)"
        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent"
      />

      <button
        onClick={shorten}
        disabled={isLoading}
        className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
      >
        {isLoading ? <Loader /> : 'Create Short URL'}
      </button>

      {shortUrl && (
        <div className="mt-6 space-y-4 text-center">
          <p className="font-mono text-lg bg-zinc-100 dark:bg-zinc-800 p-3 rounded">
            {shortUrl}
          </p>

          <button
            onClick={copyLink}
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Copy Link
          </button>

          <div className="flex flex-wrap justify-center gap-3">
            <WhatsappShareButton url={shareUrl} title={shareText}>
              <div className="bg-[#25D366] text-white px-3 py-2 rounded text-sm">WhatsApp</div>
            </WhatsappShareButton>

            <EmailShareButton url={shareUrl} subject="Short URL">
              <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm">Email</div>
            </EmailShareButton>

            <TwitterShareButton url={shareUrl}>
              <div className="bg-[#1DA1F2] text-white px-3 py-2 rounded text-sm">Twitter</div>
            </TwitterShareButton>
          </div>
        </div>
      )}
    </div>
  )
}
  