import React, { useMemo, useState } from 'react'

const PROMPTS = [
  'What did you notice in the body?',
  'Name one wholesome intention for today.',
  'Where did you experience ease?',
  'What, if anything, felt like clinging?',
  'One thing you can let go of now?',
]

export default function Journal({ onAdd, items }) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState('gratitude')
  const prompt = useMemo(() => PROMPTS[(new Date().getDay() + 7) % PROMPTS.length], [])

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 8 }}>
        {['gratitude','insight','metta','note'].map(t => (
          <button key={t} className={`tag ${tag===t?'badge':''}`} onClick={()=>setTag(t)}>{t}</button>
        ))}
      </div>
      <div className="subtle">{prompt}</div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="A few mindful lines…" />
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn primary" onClick={() => {
          if (!text.trim()) return
          onAdd({ text: text.trim(), tag })
          setText('')
        }}>Save entry</button>
        <small className="k">{text.length} chars</small>
      </div>

      <hr className="sep" />
      <div className="subtle">Recent entries</div>
      <div className="grid" style={{ gap: 8 }}>
        {items.slice().reverse().slice(0,12).map((e, i) => (
          <div key={i} className="card" style={{ padding: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="badge">{e.tag}</div>
              <small className="k">{new Date(e.date).toLocaleString()}</small>
            </div>
            <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{e.text}</div>
          </div>
        ))}
        {items.length === 0 && <div className="subtle">No entries yet.</div>}
      </div>
    </div>
  )
}
