import React, { useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav.jsx'
import BreathingRing from './components/BreathingRing.jsx'
import Timer from './components/Timer.jsx'
import Soundscape from './components/Soundscape.jsx'
import Journal from './components/Journal.jsx'
import MoodCheck from './components/MoodCheck.jsx'
import Stats from './components/Stats.jsx'
import quotes from './data/quotes.js'
import { load, save } from './lib/storage.js'
import { computeStats } from './lib/stats.js'

const TABS = ['Home', 'Breathe', 'Timer', 'Sound', 'Journal', 'Stats']

export default function App() {
  const [tab, setTab] = useState('Home')
  const [sessions, setSessions] = useState(() => load('sessions', []))
  const [journal, setJournal] = useState(() => load('journal', []))
  const [moods, setMoods] = useState(() => load('moods', []))

  useEffect(() => save('sessions', sessions), [sessions])
  useEffect(() => save('journal', journal), [journal])
  useEffect(() => save('moods', moods), [moods])

  const stats = useMemo(() => computeStats(sessions, journal), [sessions, journal])

  // Daily quote
  const quote = useMemo(() => {
    const i = new Date().toDateString().split('').reduce((a,c)=>a+c.charCodeAt(0),0) % quotes.length
    return quotes[i]
  }, [])

  function addSession(minutes) {
    const now = new Date()
    setSessions(s => [...s, { start: now.toISOString(), minutes }])
  }

  function addJournal(entry) {
    setJournal(j => [...j, { date: new Date().toISOString(), ...entry }])
  }

  function addMood(value) {
    setMoods(m => [...m, { date: new Date().toISOString(), value }])
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo" />
        <div>
          <h1>Mindsight</h1>
          <div className="subtle">Simple, private mindfulness for daily calm.</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn" onClick={() => {
            const data = { sessions, journal, moods, exportedAt: new Date().toISOString() }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'mindsight-export.json'; a.click()
            URL.revokeObjectURL(url)
          }}>Export</button>
          {' '}
          <label className="btn ghost" style={{ cursor: 'pointer' }}>
            Import
            <input type="file" accept="application/json" hidden onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const r = new FileReader()
              r.onload = () => {
                try {
                  const data = JSON.parse(r.result)
                  if (data.sessions) setSessions(data.sessions)
                  if (data.journal) setJournal(data.journal)
                  if (data.moods) setMoods(data.moods)
                  alert('Import complete.')
                } catch { alert('Invalid file.') }
              }
              r.readAsText(f)
            }}/>
          </label>
        </div>
      </div>

      <div className="card">
        {tab === 'Home' && (
          <>
            <div className="subtle" style={{ marginBottom: 6 }}>{quote.text}</div>
            <small className="k">— {quote.author}</small>
            <BreathingRing />
            <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
              <button className="btn primary" onClick={() => setTab('Breathe')}>Start Breathing</button>
              <button className="btn" onClick={() => setTab('Timer')}>1‑min Sit</button>
            </div>
            <hr className="sep" />
            <Stats inline stats={stats} />
          </>
        )}

        {tab === 'Breathe' && <BreathingRing compact={false} />}
        {tab === 'Timer' && <Timer onComplete={addSession} />}
        {tab === 'Sound' && <Soundscape />}
        {tab === 'Journal' && (
          <>
            <MoodCheck onSet={addMood} />
            <Journal onAdd={addJournal} items={journal} />
          </>
        )}
        {tab === 'Stats' && <Stats stats={stats} sessions={sessions} moods={moods} />}
      </div>

      <Nav tabs={TABS} active={tab} onChange={setTab} />
    </div>
  )
}
