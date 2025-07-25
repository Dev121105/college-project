import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import QRGenerator from './components/QRGenerator'
import PasswordGenerator from './components/PasswordGenerator'
import URLShortener from './components/URLShortener'
import SecureNotes from './components/SecureNotes'
import SecureNoteDecrypt from './pages/SecureNoteDecrypt'
import ThemeSwitcher from './components/ThemeSwitcher'
import { db } from './firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import gsap from 'gsap'

const tabs = ['QR Generator', 'Password Generator', 'URL Shortener', 'Secure Notes']

function RedirectPage() {
  const { slug } = useParams()

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const ref = doc(db, 'short_urls', slug)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const { original } = snap.data()
          window.location.href = original
        } else {
          alert('Invalid or expired short URL.')
        }
      } catch (err) {
        console.error(err)
        alert('Error fetching short URL')
      }
    }
    fetchAndRedirect()
  }, [slug])

  return (
    <div className="p-8 text-center text-xl font-semibold text-accent">
      Redirecting to original link...
    </div>
  )
}

function HomeTools() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(1)
  const [accent, setAccent] = useState('#14b8a6')
  const contentRef = useRef(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    const savedAccent = localStorage.getItem('accent') || '#14b8a6'
    setAccent(savedAccent)
    document.documentElement.style.setProperty('--tw-color-accent', savedAccent)
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { x: direction === 1 ? '100%' : '-100%' },
        { x: '0%', duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [activeTab])

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return
    setDirection(newTab > activeTab ? 1 : -1)

    if (!contentRef.current) {
      setActiveTab(newTab)
      return
    }

    gsap.to(contentRef.current, {
      x: direction === 1 ? '-100%' : '100%',
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => setActiveTab(newTab)
    })
  }

  const handleAccentChange = (color) => {
    setAccent(color)
    localStorage.setItem('accent', color)
    document.documentElement.style.setProperty('--tw-color-accent', color)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-sans transition-colors">

      <div className="absolute inset-0 z-1 max-w-[calc(100vw-180px)] max-h-[calc(100vh-180px)]">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-accent opacity-20 rounded-full blur-3xl animate-float1" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[250px] h-[250px] bg-purple-400 opacity-20 rounded-full blur-2xl animate-float2" />
        <div className="absolute top-[30%] left-[40%] w-[200px] h-[200px] bg-amber-400 opacity-10 rounded-full blur-2xl animate-float3" />
      </div>

      <header className="flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shadow-md border-b border-zinc-300 dark:border-zinc-700 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/icon.avif" alt="ToolStack Logo" className="h-8 w-8 rounded-md" />
          <h1 className="text-2xl font-extrabold tracking-tight text-accent">ToolStack</h1>
        </div>
        <ThemeSwitcher />
      </header>

      <nav className="flex justify-center mt-6 gap-3 px-4 bg-zinc-100/80 dark:bg-zinc-800/80 p-2 rounded-full shadow-inner ring-1 ring-zinc-200 dark:ring-zinc-700 w-fit mx-auto backdrop-blur-sm">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabSwitch(idx)}
            className={`px-5 py-2 text-sm rounded-full font-medium transition-all duration-200 ${
              activeTab === idx
                ? 'bg-accent text-white shadow-lg scale-105'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300/40 dark:hover:bg-zinc-700/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="relative p-6 max-w-3xl mx-auto">
        <div
          ref={contentRef}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-zinc-200 dark:border-zinc-700 "
        >
          {activeTab === 0 && <QRGenerator />}
          {activeTab === 1 && <PasswordGenerator />}
          {activeTab === 2 && <URLShortener />}
          {activeTab === 3 && <SecureNotes />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeTools />} />
        <Route path="/:slug" element={<RedirectPage />} />
        <Route path="/secure/:id" element={<SecureNoteDecrypt />} />
      </Routes>
    </Router>
  )
}
