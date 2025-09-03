import React, { useMemo } from 'react'

function Spark({ data }) {
  const max = Math.max(1, ...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * 100
    const y = 100 - (v / max) * 100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="sparkline" preserveAspectRatio="none" aria-hidden="true">
      <polyline fill="none" stroke="currentColor" strokeWidth="3" points={pts} opacity="0.85" />
    </svg>
  )
}

export default function Stats({ stats, inline=false }) {
  const { totalMinutes, totalSessions, streak, last7 } = stats

  const tiles = (
    <div className="grid three">
      <div className="card">
        <div className="subtle">Total minutes</div>
        <div style={{ fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{totalMinutes}</div>
      </div>
      <div className="card">
        <div className="subtle">Sessions</div>
        <div style={{ fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{totalSessions}</div>
      </div>
      <div className="card">
        <div className="subtle">Streak</div>
        <div style={{ fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{streak} days</div>
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className="grid" style={{ gap: 8 }}>
        <div className="row" style={{ gap: 10 }}>
          <div className="badge">Total: {totalMinutes} min</div>
          <div className="badge">Sessions: {totalSessions}</div>
          <div className="badge">Streak: {streak}d</div>
        </div>
        <Spark data={last7} />
      </div>
    )
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      {tiles}
      <div className="card">
        <div className="subtle">Last 7 days (minutes)</div>
        <Spark data={last7} />
      </div>
      <div className="row" style={{ gap: 8 }}>
        {totalMinutes >= 10 && <div className="badge">🌱 Settling in</div>}
        {totalMinutes >= 60 && <div className="badge">🧘 One‑Hour Club</div>}
        {streak >= 7 && <div className="badge">🔥 Week Streak</div>}
      </div>
    </div>
  )
}
