import React, { useEffect, useRef, useState } from 'react'

const PATTERNS = [
  { name: 'Box 4‑4‑4‑4', steps: [4, 4, 4, 4], labels: ['Inhale', 'Hold', 'Exhale', 'Hold'] },
  { name: '4‑7‑8', steps: [4, 7, 8], labels: ['Inhale', 'Hold', 'Exhale'] },
  { name: 'Anapanasati (soft)', steps: [5, 0, 5, 0], labels: ['Inhale', '', 'Exhale', ''] }
]

export default function BreathingRing({ compact = true }) {
  const [pattern, setPattern] = useState(PATTERNS[0])
  const [phase, setPhase] = useState(0)
  const [sec, setSec] = useState(pattern.steps[0])
  const [running, setRunning] = useState(false)
  const [arc, setArc] = useState(0)
  const rafRef = useRef()
  const startRef = useRef()
  const totalRef = useRef()

  useEffect(() => {
    setPhase(0)
    setSec(pattern.steps[0])
  }, [pattern])

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    totalRef.current = pattern.steps[phase] || 1
    startRef.current = performance.now()
    const tick = (t) => {
      const elapsed = (t - startRef.current) / 1000
      const remain = Math.max(0, totalRef.current - elapsed)
      setSec(remain.toFixed(0))
      setArc(100 * (elapsed / totalRef.current))
      if (remain <= 0.01) {
        // next phase
        const next = (phase + 1) % pattern.steps.length
        setPhase(next)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, phase, pattern])

  useEffect(() => {
    // skip zero-length holds smoothly
    if (running && pattern.steps[phase] === 0) {
      setPhase((p) => (p + 1) % pattern.steps.length)
    }
  }, [phase, pattern, running])

  useEffect(() => {
    document.documentElement.style.setProperty('--arc', `${arc}%`)
  }, [arc])

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8 }}>
          {PATTERNS.map(p => (
            <button
              key={p.name}
              className={`btn ${p.name === pattern.name ? 'primary' : ''}`}
              onClick={() => setPattern(p)}
            >{p.name}</button>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
          <button className="btn ghost" onClick={() => { setPhase(0); setArc(0); setRunning(false); setSec(pattern.steps[0]) }}>Reset</button>
        </div>
      </div>

      <div className="breathe-ring" role="img" aria-label="Breathing ring">
        <div className="breathe-label">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, opacity: .9, minHeight: 26 }}>
              {pattern.labels[phase] || 'Breathe'}
            </div>
            <div style={{ fontSize: 36, fontVariantNumeric: 'tabular-nums' }}>{sec}</div>
          </div>
        </div>
      </div>

      {compact ? null : (
        <div className="subtle" style={{ textAlign: 'center' }}>
          Tip: breathe gently through the nose; let the count guide, not strain.
        </div>
      )}
    </div>
  )
}
