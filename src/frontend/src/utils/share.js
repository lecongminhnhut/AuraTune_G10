// Chia sẻ bằng Web Share API khi có, nếu không thì sao chép liên kết vào clipboard.
export async function shareLink(path, title) {
  const url = new URL(path, window.location.origin).toString()
  try {
    if (navigator.share) {
      await navigator.share({ title, url })
      return 'shared'
    }
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled'
    return 'failed'
  }
}

export const shareMessage = (result) => ({
  shared: 'Đã mở hộp thoại chia sẻ.',
  copied: 'Đã sao chép liên kết vào bộ nhớ tạm.',
  failed: 'Không thể chia sẻ lúc này. Hãy thử sao chép liên kết từ thanh địa chỉ.',
})[result]

export const trackSharePath = (track) => track.albumId ? `/album/${track.albumId}?track=${track.id}` : `/search?q=${encodeURIComponent(track.title)}`
