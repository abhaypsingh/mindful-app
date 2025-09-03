import React, { useEffect, useRef, useState } from 'react'

function useBell() {
  // Simple struck bell via Web Audio API
  const ctxRef = useRef(null)
  function ring() {
    const ctx = ctxRef.current || new AudioContext()
    ctxRef.current = ctx
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 660
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 1.25)
  }
  return ring
}

export default function Timer({ onComplete }) {
  const [mins, setMins] = useState(1)
  const [running, setRunning] = useState(false)
  const [left, setLeft] = useState(mins * 60)
  const [intervalBell, setIntervalBell] = useState(0) // minutes, 0=off
  const ring = useBell()
  const startRef = useRef(0)
  const rafRef = useRef()

  useEffect(() => setLeft(mins * 60), [mins])

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    startRef.current = performance.now()
    const end = startRef.current + left * 1000
    const loop = (t) => {
      const remain = Math.max(0, Math.round((end - t) / 1000))
      setLeft(remain)
      if (remain <= 0) {
        ring()
        setRunning(false)
        onComplete?.(mins)
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    // interval chime
    let intervalId
    if (intervalBell > 0) {
      intervalId = setInterval(() => ring(), intervalBell * 60 * 1000)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(intervalId) }
  }, [running])

  const m = String(Math.floor(left / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid three">
        {[1, 3, 5, 10, 15, 20].map(v => (
          <button
            key={v}
            className={`btn ${mins === v ? 'primary' : ''}`}
            onClick={() => { setMins(v); setLeft(v * 60) }}
          >{v} min</button>
        ))}
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="badge">Interval bell</div>
        <select
          value={intervalBell}
          onChange={e => setIntervalBell(Number(e.target.value))}
          style={{ padding: 10, borderRadius: 10, background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,.12)' }}
        >
          {[0,1,2,3,5,10].map(v => <option key={v} value={v} style={{ color: 'black' }}>{v === 0 ? 'Off' : `${v} min`}</option>)}
        </select>
      </div>

      <div className="breathe-ring">
        <div className="breathe-label" aria-live="polite" aria-atomic="true" style={{ fontSize: 36 }}>{m}:{s}</div>
      </div>

      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn primary" onClick={() => setRunning(true)} disabled={running}>Start</button>
        <button className="btn" onClick={() => setRunning(false)} disabled={!running}>Pause</button>
        <button className="btn ghost" onClick={() => { setRunning(false); setLeft(mins * 60) }}>Reset</button>
      </div>
    </div>
  )
}
