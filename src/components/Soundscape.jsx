import React, { useEffect, useRef, useState } from 'react'

function createCtx(ctxRef) {
  if (ctxRef.current) return ctxRef.current
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  ctxRef.current = ctx
  return ctx
}

function makeNoise(ctx, type='white') {
  const bufferSize = 2 * ctx.sampleRate
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  let lastOut = 0
  for (let i=0; i<bufferSize; i++) {
    const white = Math.random() * 2 - 1
    if (type === 'white') output[i] = white
    else if (type === 'pink') output[i] = (output[i-1] || 0) * 0.97 + 0.03 * white
    else if (type === 'brown') { lastOut = (lastOut + 0.02 * white) / 1.02; output[i] = lastOut * 3.5 }
  }
  const node = ctx.createBufferSource()
  node.buffer = noiseBuffer
  node.loop = true
  return node
}

export default function Soundscape() {
  const ctxRef = useRef(null)
  const [mode, setMode] = useState('Waves')
  const [playing, setPlaying] = useState(false)
  const [vol, setVol] = useState(0.3)
  const gainRef = useRef()

  useEffect(() => {
    if (!playing) return
    const ctx = createCtx(ctxRef)
    const gain = ctx.createGain(); gain.gain.value = vol
    gainRef.current = gain

    const noise = makeNoise(ctx, 'white')
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = mode === 'Rain' ? 1800 : 800

    // Simple LFO for waves
    let lfo, lfoGain
    if (mode === 'Waves') {
      lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.2
      lfoGain = ctx.createGain(); lfoGain.gain.value = 700
      lfo.connect(lfoGain).connect(filter.frequency)
      lfo.start()
    }

    // “Om” layer (three sines) if chosen
    let o1,o2,o3, omGain
    if (mode === 'Om') {
      omGain = ctx.createGain(); omGain.gain.value = 0.12
      o1 = ctx.createOscillator(); o2 = ctx.createOscillator(); o3 = ctx.createOscillator()
      o1.type = o2.type = o3.type = 'sine'
      o1.frequency.value = 136.1 // C#3-ish (solar year frequency, often used for “OM” drones)
      o2.frequency.value = 272.2
      o3.frequency.value = 544.4
      o1.connect(omGain); o2.connect(omGain); o3.connect(omGain)
      omGain.connect(gain)
      o1.start(); o2.start(); o3.start()
    }

    noise.connect(filter).connect(gain).connect(ctx.destination)
    noise.start()

    return () => {
      try { noise.stop() } catch {}
      [lfo, o1, o2, o3].forEach(n => { try { n && n.stop() } catch {} })
      ;[noise, filter, gain, lfo, lfoGain, o1, o2, o3, omGain].forEach(n => { try { n && n.disconnect() } catch {} })
    }
  }, [playing, mode])

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = vol
  }, [vol])

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8 }}>
          {['Waves','Rain','Om'].map(m => (
            <button key={m} className={`btn ${mode === m ? 'primary':''}`} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={() => setPlaying(p => !p)}>{playing ? 'Stop' : 'Play'}</button>
        </div>
      </div>
      <div>
        <div className="subtle">Volume</div>
        <input type="range" min="0" max="1" step="0.01" value={vol} onChange={e => setVol(parseFloat(e.target.value))} />
      </div>
      <div className="subtle">Pro tip: layer a gentle soundscape with the breathing or timer for deeper focus.</div>
    </div>
  )
}
