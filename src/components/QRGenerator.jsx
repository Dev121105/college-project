import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { db } from '../firebase/config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { WhatsappShareButton, EmailShareButton, TwitterShareButton } from 'react-share'

export default function QRGenerator() {
  const [text, setText] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(256)
  const qrRef = useRef()

  const generateAndSave = async () => {
    if (!text.trim()) return alert('Enter something to generate QR')
    const qrData = { text, fgColor, bgColor, size, createdAt: serverTimestamp() }
    await addDoc(collection(db, 'qr_codes'), qrData)
    alert('QR Code saved to Firebase')
  }

  const handleDownload = (format) => {
    const canvas = qrRef.current?.querySelector('canvas')
    const svg = qrRef.current?.querySelector('svg')

    if (!canvas && !svg) {
      alert('QR code not available')
      return
    }

    if (format === 'png' && canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${Date.now()}.png`
      link.click()
    }

    if (format === 'svg' && svg) {
      const serializer = new XMLSerializer()
      const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${Date.now()}.svg`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const shareUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    text
  )}&size=${size}x${size}`

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-accent">🔳 QR Code Generator</h2>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text or URL..."
        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-accent"
      />

      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm">Size:
          <input
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="ml-2"
          />
        </label>

        <label className="text-sm">Foreground:
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="ml-2"
          />
        </label>

        <label className="text-sm">Background:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="ml-2"
          />
        </label>
      </div>

      <div
        ref={qrRef}
        className="p-4 border rounded-xl bg-white dark:bg-zinc-900 w-full max-w-sm mx-auto overflow-hidden"
      >
        <div className="w-full aspect-square flex items-center justify-center">
          <QRCodeCanvas
            key={`${text}-${fgColor}-${bgColor}-${size}`}
            value={text.trim() !== '' ? text : ' '}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={generateAndSave}
          className="bg-accent text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          Save to Firebase
        </button>
        <button
          onClick={() => handleDownload('png')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => handleDownload('svg')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Download SVG
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <WhatsappShareButton url={shareUrl}>
          <div className="bg-[#25D366] text-white px-3 py-1 rounded-lg text-sm">WhatsApp</div>
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl} subject="QR Code Link">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">Email</div>
        </EmailShareButton>
        <TwitterShareButton url={shareUrl} title="Scan this QR!">
          <div className="bg-[#1DA1F2] text-white px-3 py-1 rounded-lg text-sm">Twitter</div>
        </TwitterShareButton>
      </div>
    </div>
  )
}
