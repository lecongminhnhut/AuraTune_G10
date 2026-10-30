import { createContext, useContext } from 'react'

// Cung cấp trình phát và các thao tác phát nhạc cho mọi trang mà không cần truyền props qua nhiều tầng.
export const PlayerContext = createContext(null)

export function usePlayer() {
  const value = useContext(PlayerContext)
  if (!value) throw new Error('usePlayer phải được dùng bên trong PlayerContext.Provider')
  return value
}
