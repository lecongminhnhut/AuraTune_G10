import React, { createContext, useContext } from 'react';

// Cung cấp trình phát và các thao tác phát nhạc cho mọi trang mà không cần truyền props qua nhiều tầng.
export const PlayerContext = createContext(null);

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error('usePlayer phải được dùng bên trong PlayerContext.Provider');
  return value;
}

/**
 * Safe player bridge interface (T008)
 * Wraps player instance with defensive checks so null/invalid inputs
 * never throw or mutate the HTML5 audio element inappropriately.
 */
export function createSafePlayerBridge(player) {
  if (!player) {
    return {
      isPlaying: false,
      volume: 50,
      track: null,
      queue: [],
      playCollection: () => false,
      togglePlayback: () => {},
      nextTrack: () => {},
      previousTrack: () => {},
      setVolume: () => {},
      addManyToQueue: () => 0,
      clearUpcoming: () => {},
      playNext: () => false,
    };
  }

  return {
    ...player,
    playCollection(items, options = {}) {
      if (!Array.isArray(items) || items.length === 0) return false;
      return player.playCollection ? player.playCollection(items, options) : false;
    },
    togglePlayback() {
      if (typeof player.togglePlayback === 'function') {
        player.togglePlayback();
      }
    },
    nextTrack() {
      if (typeof player.nextTrack === 'function') {
        player.nextTrack();
      }
    },
    previousTrack() {
      if (typeof player.previousTrack === 'function') {
        player.previousTrack();
      }
    },
    setVolume(value) {
      if (typeof player.setVolume === 'function') {
        const num = Number(value);
        const clamped = Math.max(0, Math.min(100, Number.isFinite(num) ? Math.round(num) : 50));
        player.setVolume(clamped);
      }
    },
    addManyToQueue(items) {
      if (!Array.isArray(items) || items.length === 0) return 0;
      return typeof player.addManyToQueue === 'function' ? player.addManyToQueue(items) : 0;
    },
    clearUpcoming() {
      if (typeof player.clearUpcoming === 'function') {
        player.clearUpcoming();
      }
    },
    playNext(track) {
      if (!track || typeof track !== 'object') return false;
      return typeof player.playNext === 'function' ? player.playNext(track) : false;
    },
  };
}

/**
 * Automatic listening history dispatch helper (FR-010, SC-005 - T040)
 * Sends POST /api/v1/users/me/history with ISO8601 timestamp upon assisted playback start.
 */
export async function recordAssistedListeningHistory(songId, { token } = {}) {
  if (!songId) return false;
  const payload = {
    songId,
    listenedAt: new Date().toISOString(),
    source: 'ai_assistant',
  };

  try {
    const apiBase =
      (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.VITE_API_URL) ||
      '';
    const res = await fetch(`${apiBase}/api/v1/users/me/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    // Non-blocking fire-and-forget
    return false;
  }
}

export default PlayerContext;
