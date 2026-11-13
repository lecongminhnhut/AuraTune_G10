export function artistError(res, status, code, message) {
  return res.status(status).json({ success: false, message, data: null, error: { code, details: [] } });
}

export function getArtistProfile(req, res) {
  return res.status(200).json({ success: true, message: 'Artist profile loaded', data: req.publicArtist, error: null });
}
