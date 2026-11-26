// Feature 046 (FR-001..FR-005): share with the Web Share API when the device has it, otherwise copy
// the link. Results: 'shared' | 'copied' | 'cancelled' | 'failed'. The caller shows no message
// for 'cancelled' (FR-004).
const browser = () => ({ origin: globalThis.location?.origin, nav: globalThis.navigator, doc: globalThis.document })

// Copy through a hidden text field. Used when the Clipboard API is missing (pages not served over
// HTTPS or localhost) or refuses to write (permission denied, for example in embedded browsers).
function legacyCopy(doc, text) {
  if (!doc?.body || typeof doc.createElement !== 'function' || typeof doc.execCommand !== 'function') return false
  const previousFocus = doc.activeElement
  const field = doc.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.setAttribute('aria-hidden', 'true')
  Object.assign(field.style, { position: 'fixed', top: '0', left: '0', opacity: '0', pointerEvents: 'none' })
  doc.body.appendChild(field)
  try {
    field.select()
    return doc.execCommand('copy') === true
  } catch {
    return false
  } finally {
    field.remove()
    previousFocus?.focus?.({ preventScroll: true })
  }
}

async function copyText({ nav, doc }, url) {
  if (nav?.clipboard?.writeText) {
    try {
      await nav.clipboard.writeText(url)
      return 'copied'
    } catch {
      // Fall back to the text-field copy below.
    }
  }
  return legacyCopy(doc, url) ? 'copied' : 'failed'
}

export async function shareLink(path, title, { origin, nav, doc } = browser()) {
  const url = new URL(path, origin).toString()
  if (!nav?.share) return copyText({ nav, doc }, url)
  try {
    await nav.share({ title, url })
    return 'shared'
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled'
    // The share sheet exists but could not open (for example NotAllowedError): copy the link instead.
    return copyText({ nav, doc }, url)
  }
}

export async function copyLink(path, { origin, nav, doc } = browser()) {
  return copyText({ nav, doc }, new URL(path, origin).toString())
}

export const shareMessage = (result) => ({
  shared: 'Đã mở hộp thoại chia sẻ.',
  copied: 'Đã sao chép liên kết vào bộ nhớ tạm.',
  failed: 'Không thể chia sẻ lúc này. Hãy thử sao chép liên kết từ thanh địa chỉ.',
})[result]

// FR-005: a link that opens content containing the track. The spec prefers the album page, but the
// album page (Group 080) loads GET /api/v1/albums/:id, which the backend does not serve yet, so an
// album link opens an error page. Until it does, every track is shared as a search for its title,
// which lists the track for guests and signed-in listeners alike.
export const ALBUM_SHARE_LINKS = false

export const trackSharePath = (track, { albumLinks = ALBUM_SHARE_LINKS } = {}) => (albumLinks && track.albumId
  ? `/album/${encodeURIComponent(track.albumId)}?track=${encodeURIComponent(track.id)}`
  : `/search?q=${encodeURIComponent(track.title)}`)
