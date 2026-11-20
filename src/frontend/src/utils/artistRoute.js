export function decodeArtistRouteId(value) {
  try { return decodeURIComponent(value); } catch { return null; }
}

export async function copyArtistLink(id, { origin = globalThis.location?.origin, clipboard = globalThis.navigator?.clipboard } = {}) {
  if (!origin || !clipboard?.writeText) throw new Error('Clipboard unavailable');
  const url = new URL(`/artist/${encodeURIComponent(id)}`, origin).href;
  await clipboard.writeText(url);
  return url;
}
