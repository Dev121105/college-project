import { useState } from 'react'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function SecureNotes() {
  const [note, setNote] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [noteId, setNoteId] = useState(null)
  const [autoDelete, setAutoDelete] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleSave = async () => {
    if (!note.trim() || !passphrase.trim()) return alert('Fill both fields')

    const encrypted = btoa(`${note}||${passphrase}`)

    const docRef = await addDoc(collection(db, 'secure_notes'), {
      encrypted,
      autoDelete,
      createdAt: serverTimestamp()
    })

    setNoteId(docRef.id)
    setNote('')
    setPassphrase('')
    setAutoDelete(true)
    setCopied(false)
  }

  const shortUrl = `${window.location.origin}/RedirectPage/${noteId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy link.')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🗒️ Secure Notes</h2>

      <textarea
        rows="6"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your secure message..."
        className="w-full p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-accent"
      />

      <input
        type="password"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Secret passphrase"
        className="w-full p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-accent"
      />

      <label className="flex items-center gap-2 text-sm mt-2">
        <input
          type="checkbox"
          checked={autoDelete}
          onChange={() => setAutoDelete(!autoDelete)}
        />
        Auto-delete after viewed
      </label>

      <button
        onClick={handleSave}
        className="bg-accent text-white px-4 py-2 rounded shadow hover:opacity-90 transition-all"
      >
        Save Secure Note
      </button>

      {noteId && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">🔗 Share this link:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono p-2 rounded bg-zinc-100 dark:bg-zinc-800 break-all text-sm">
              {shortUrl}
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
