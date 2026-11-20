const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const personalContextPattern = /(?:my name is|i am|i'm|call me|tên tôi là|toi la|gọi tôi là|goi toi la)\s+([\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*){0,2})/iu

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('vi-VN')

export function createSemanticPrivacyGuard({ getArtistNames = async () => [] } = {}) {
  let artistNames = null
  return {
    async inspect(query, profile = null) {
      const names = artistNames || (artistNames = new Set((await getArtistNames()).map(normalize).filter(Boolean)))
      const normalizedQuery = normalize(query)
      const identityValues = [profile?.name, profile?.display_name, profile?.displayName, profile?.email].map(normalize).filter(Boolean)
      if (emailPattern.test(query)) return { safe: false, reason: 'email_detected', sanitizedQuery: null }
      if (identityValues.some((value) => value.length > 1 && normalizedQuery.includes(value))) return { safe: false, reason: 'profile_identity_detected', sanitizedQuery: null }
      const contextualName = personalContextPattern.exec(query)?.[1]?.trim()
      if (contextualName && !names.has(normalize(contextualName))) return { safe: false, reason: 'ambiguous_personal_name', sanitizedQuery: null }
      return { safe: true, reason: null, sanitizedQuery: String(query).trim() }
    },
    invalidateArtists() { artistNames = null },
  }
}
