import { useCallback, useEffect, useRef, useState } from 'react';
import { loadArtistProfile } from '../services/artistProfileService.js';

export function useArtistProfile(artistId) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ artistId: null, attempt: -1, status: 'loading', artist: null });
  const generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    const controller = new AbortController();
    setState({ artistId, attempt, status: 'loading', artist: null });
    loadArtistProfile(artistId, { signal: controller.signal }).then(artist => {
      if (!controller.signal.aborted && current === generation.current) setState({ artistId, attempt, status: 'ready', artist });
    }).catch(error => {
      if (controller.signal.aborted || current !== generation.current) return;
      setState({ artistId, attempt, status: ['not-found', 'invalid-id'].includes(error.kind) ? 'not-found' : 'error', artist: null });
    });
    return () => { controller.abort(); generation.current++; };
  }, [artistId, attempt]);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  // Hide the previous identity during render, before the next effect runs.
  const active = state.artistId === artistId && state.attempt === attempt ? state : { status: 'loading', artist: null };
  return { ...active, retry };
}
