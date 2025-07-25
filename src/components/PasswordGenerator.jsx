// src/components/PasswordGenerator.jsx
import { useState, useRef, useEffect } from 'react'
import { db } from '../firebase/config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { saveAs } from 'file-saver'
import { WhatsappShareButton, EmailShareButton } from 'react-share'
import Loader from '../components/Loader'
import gsap from 'gsap'

const generatePassword = (length, useSymbols, useNumbers, useUppercase) => {
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='

  let chars = lower
  if (useUppercase) chars += upper
  if (useNumbers) chars += numbers
  if (useSymbols) chars += symbols

  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  return password
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(12)
  const [useSymbols, setUseSymbols] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useUppercase, setUseUppercase] = useState(true)
  const [password, setPassword] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }, [])

  const handleGenerate = () => {
    const newPass = generatePassword(length, useSymbols, useNumbers, useUppercase)
    setPassword(newPass)
  }

  const saveToFirebase = async () => {
    if (!password) return alert('Generate a password first')
    await addDoc(collection(db, 'passwords'), {
      password,
      length,
      useSymbols,
      useNumbers,
      useUppercase,
      createdAt: serverTimestamp()
    })
    alert('Password saved to Firebase ')
  }

  const downloadTxt = () => {
    const blob = new Blob([`Your password: ${password}`], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'secure-password.txt')
  }

  return (
    <div ref={ref} className="space-y-6">
      <h2 className="text-xl font-semibold text-accent">🔐 Password Generator</h2>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">
          Length: {length}
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} />
            Symbols
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} />
            Numbers
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} />
            Uppercase
          </label>
        </div>

        <button
          onClick={handleGenerate}
          className="bg-accent text-white px-4 py-2 rounded shadow w-fit hover:opacity-90 transition"
        >
          Generate Password
        </button>

        {password && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-lg break-all text-center">
              {password}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={saveToFirebase} className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">
                Save to Firebase
              </button>
              <button onClick={downloadTxt} className="bg-indigo-600 text-white px-4 py-2 rounded hover:opacity-90">
                Download .txt
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <WhatsappShareButton title={`Use this password: ${password}`} url="">
                <div className="bg-[#25D366] text-white px-3 py-1 rounded">WhatsApp</div>
              </WhatsappShareButton>
              <EmailShareButton subject="Your Password" body={`Here is your generated password:\n${password}`} url="">
                <div className="bg-blue-500 text-white px-3 py-1 rounded">Email</div>
              </EmailShareButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
