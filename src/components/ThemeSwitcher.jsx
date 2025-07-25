// src/components/ThemeSwitcher.jsx
import { useEffect, useState } from 'react'

const accents = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#14b8a6']

export default function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark'
    setDarkMode(saved)
    document.documentElement.classList.toggle('dark', saved)
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newMode)
  }

  const changeAccent = (color) => {
    document.documentElement.style.setProperty('--tw-color-accent', color)
    localStorage.setItem('accent', color)
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleTheme}
        className="px-3 py-1 text-sm rounded bg-zinc-300 dark:bg-zinc-700"
      >
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>
      <div className="flex items-center gap-1">
        {accents.map((color, i) => (
          <button
            key={i}
            onClick={() => changeAccent(color)}
            className="w-5 h-5 rounded-full border border-white"
            style={{ backgroundColor: color }}
          ></button>
        ))}
      </div>
    </div>
  )
}
