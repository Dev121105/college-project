// src/pages/SecureNoteDecrypt.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import Loader from '../components/Loader'

export default function SecureNoteDecrypt() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [encryptedNote, setEncryptedNote] = useState(null)
  const [passphrase, setPassphrase] = useState('')
  const [decrypted, setDecrypted] = useState(null)
  const [loading, setLoading] = useState(true)
  const [autoDelete, setAutoDelete] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const ref = doc(db, 'secure_notes', id)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          if (data.encrypted) {
            setEncryptedNote(data.encrypted)
            setAutoDelete(data.autoDelete ?? false)
          } else {
            alert('❌ Missing encrypted content.')
          }
        } else {
          alert('❌ Note not found or expired.')
          navigate('/')
        }
      } catch (err) {
        alert('Failed to fetch secure note.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id, navigate])

  const handleDecrypt = () => {
    if (!encryptedNote || typeof encryptedNote !== 'string') {
      alert('Secure note is invalid or missing.')
      return
    }

    try {
      const decoded = atob(encryptedNote)
      if (!decoded.includes('||')) {
        alert('Invalid or corrupted encrypted data.')
        return
      }

      const [originalNote, storedPass] = decoded.split('||')
      if (passphrase === storedPass) {
        setDecrypted(originalNote)

        if (autoDelete) {
          let seconds = 5
          setCountdown(seconds)

          const interval = setInterval(async () => {
            seconds--
            setCountdown(seconds)

            if (seconds === 0) {
              clearInterval(interval)
              try {
                const ref = doc(db, 'secure_notes', id)
                await deleteDoc(ref)
              } catch (err) {
                console.error('Failed to delete:', err)
              }
            }
          }, 1000)
        }

      } else {
        alert('❌ Wrong passphrase')
      }
    } catch (err) {
      console.error('Failed to decode or delete:', err)
      alert('⚠️ Decryption failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-accent">🔓 Decrypt Secure Note</h2>

        {loading ? (
         <Loader/>
        ) : !encryptedNote ? (
          <p className="text-sm text-red-500">⚠️ This note was not found or may have expired.</p>
        ) : !decrypted ? (
          <>
            <input
              type="password"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-accent"
            />

            <button
              onClick={handleDecrypt}
              className="bg-accent text-white w-full px-4 py-2 rounded shadow hover:opacity-90 transition"
            >
              Decrypt Note
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded whitespace-pre-wrap">
              {decrypted}
            </div>

            {autoDelete && (
              <p className="text-sm text-red-500 text-center">
                ⏳ Auto-deleting this note in {countdown} second{countdown !== 1 && 's'}...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
