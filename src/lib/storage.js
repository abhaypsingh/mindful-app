export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`ms_${key}`)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
export function save(key, val) {
  try { localStorage.setItem(`ms_${key}`, JSON.stringify(val)) } catch {}
}
