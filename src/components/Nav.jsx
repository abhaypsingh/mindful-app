import React from 'react'

export default function Nav({ tabs, active, onChange }) {
  return (
    <nav className="tabs" aria-label="Primary">
      {tabs.map(t => (
        <button
          key={t}
          className={['tab', active === t ? 'active' : ''].join(' ')}
          aria-current={active === t ? 'page' : undefined}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </nav>
  )
}
