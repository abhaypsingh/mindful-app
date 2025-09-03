import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Optional: register service worker if present
if ('serviceWorker' in navigator) {
  const swUrl = '/sw.js'
  fetch(swUrl, { method: 'HEAD' })
    .then((res) => {
      if (res.ok) navigator.serviceWorker.register(swUrl)
    })
    .catch(() => {})
}
