import React, { useState } from 'react'

const FACES = [
  { n: 1, label: 'Low', emoji: '\uD83D\uDE14' },
  { n: 2, label: 'Tender', emoji: '\uD83D\uDE42' },
  { n: 3, label: 'Balanced', emoji: '\uD83D\uDE0C' },
  { n: 4, label: 'Bright', emoji: '\uD83D\uDE0A' },
  { n: 5, label: 'Joyful', emoji: '\uD83D\uDE03' }
]

export default function MoodCheck({ onSet }) {
  const [picked, setPicked] = useState(0)
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <div className="badge">Mood check\u2011in</div>
      <div className="row" role="radiogroup" aria-label="Mood">
        {FACES.map(f => (
          <button
            key={f.n}
            className={`btn ${picked === f.n ? 'primary' : ''}`}
            role="radio"
            aria-checked={picked === f.n}
            onClick={() => { setPicked(f.n); onSet(f.n) }}
            title={f.label}
          >
            <span style={{ fontSize: 20, marginRight: 6 }}>{f.emoji}</span>{f.n}
          </button>
        ))}
      </div>
    </div>
  )
}
