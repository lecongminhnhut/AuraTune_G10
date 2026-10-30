import { useEffect, useState } from 'react'

const currentLocation = () => ({ pathname: window.location.pathname, search: window.location.search })

export function navigate(path, { replace = false } = {}) {
  if (path === window.location.pathname + window.location.search) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useLocation() {
  const [location, setLocation] = useState(currentLocation)

  useEffect(() => {
    const update = () => setLocation(currentLocation())
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])

  return location
}

export const getQueryParam = (search, key) => new URLSearchParams(search).get(key) ?? ''

export const loginPath = (next = window.location.pathname + window.location.search) => `/login?next=${encodeURIComponent(next)}`

// Thẻ <a> dùng điều hướng nội bộ; vẫn cho phép Ctrl/Cmd + click để mở tab mới.
export function Link({ to, onClick, children, ...props }) {
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        navigate(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
