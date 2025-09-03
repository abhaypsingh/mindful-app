function ymd(d) { const dt = new Date(d); return dt.toISOString().slice(0,10) }

export function computeStats(sessions, journal=[]) {
  const totalMinutes = Math.round(sessions.reduce((a,s)=>a+s.minutes,0))
  const totalSessions = sessions.length
  const days = new Set([...sessions.map(s => ymd(s.start)), ...journal.map(j => ymd(j.date))])

  // Streak: count back from today
  let streak = 0
  const today = new Date(); today.setHours(0,0,0,0)
  for (let i=0;i<4000;i++) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    if (days.has(d.toISOString().slice(0,10))) streak++
    else break
  }

  // Last 7 days minutes
  const last7 = []
  for (let i=6;i>=0;i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0,10)
    const m = Math.round(sessions.filter(s => ymd(s.start) === key).reduce((a,s)=>a+s.minutes,0))
    last7.push(m)
  }
  return { totalMinutes, totalSessions, streak, last7 }
}
