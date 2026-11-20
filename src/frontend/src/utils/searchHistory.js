const STORAGE_KEY = 'auratune-search-history-v1'
const MAX_ENTRIES = 10
let memoryHistory = []

const storage = () => {
  try { return window.localStorage } catch { return null }
}

export function getSearchHistory() {
  try {
    const value = storage()?.getItem(STORAGE_KEY)
    if (!value) return [...memoryHistory]
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return [...memoryHistory]
    memoryHistory = parsed.filter((item) => typeof item === 'string' && item.trim()).slice(0, MAX_ENTRIES)
    return [...memoryHistory]
  } catch { return [...memoryHistory] }
}

const persist = () => { try { storage()?.setItem(STORAGE_KEY, JSON.stringify(memoryHistory)) } catch { /* LocalStorage may be unavailable. */ } }

export function addSearchHistory(value) {
  const query = String(value ?? '').trim()
  if (!query) return getSearchHistory()
  memoryHistory = [query, ...getSearchHistory().filter((item) => item !== query)].slice(0, MAX_ENTRIES)
  persist()
  return [...memoryHistory]
}

export function removeSearchHistory(value) { memoryHistory = getSearchHistory().filter((item) => item !== value); persist(); return [...memoryHistory] }
export function clearSearchHistory() { memoryHistory = []; try { storage()?.removeItem(STORAGE_KEY) } catch { /* Keep the in-memory state usable. */ } return [] }
export const SEARCH_HISTORY_LIMIT = MAX_ENTRIES
