export function createArtistTrackService(repository) {
  return {read:(actor,section)=>repository.read(actor,section)};
}
