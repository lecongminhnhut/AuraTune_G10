import { useMemo } from 'react'
import PlaylistCard from '../../components/playlist/PlaylistCard.jsx'
import { AlbumCard, ArtistCard, GenreTile } from '../../components/playlist/MediaCards.jsx'
import SongTable from '../../components/song/SongTable.jsx'
import { EmptyState, PageHeader, SectionHeading, chipClass } from '../../components/common/ui.jsx'
import { useStore } from '../../context/AppStore.jsx'
import { usePlayer } from '../../context/PlayerContext.jsx'
import { genres, getArtist, getGenre, playlists } from '../../utils/mockData.js'
import { Link, getQueryParam, useLocation } from '../../utils/navigation.jsx'

const grid = 'mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export default function ExplorePage() {
  const store = useStore()
  const player = usePlayer()
  const { search } = useLocation()
  const genreId = getQueryParam(search, 'genre')
  const genre = getGenre(genreId)

  const genreTracks = useMemo(() => store.publicTracks.filter((track) => track.genre === genreId), [store.publicTracks, genreId])
  const genreAlbums = useMemo(() => store.albums.filter((album) => album.genre === genreId), [store.albums, genreId])
  const genrePlaylists = useMemo(() => playlists.filter((playlist) => playlist.trackIds.some((id) => genreTracks.some((track) => track.id === id))), [genreTracks])
  const genreArtists = useMemo(() => [...new Set(genreTracks.map((track) => track.artistId))].map(getArtist).filter((artist) => artist?.isPublic), [genreTracks])
  const playAlbum = (album) => player.playCollection(store.publicTracks.filter((track) => track.albumId === album.id))

  return (
    <div className="pb-12">
      <PageHeader eyebrow="Khám phá" title={genre ? genre.name : 'Khám phá âm nhạc'} description={genre ? genre.description : 'Duyệt theo thể loại, tuyển tập và những phát hành mới.'}>
        {genre && genreTracks.length > 0 && <button type="button" onClick={() => player.playCollection(genreTracks)} className="rounded-full bg-violet-300 px-5 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-violet-200">Phát {genre.name}</button>}
      </PageHeader>

      <div className="px-5 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" aria-label="Thể loại">
          <Link to="/explore" className={chipClass(!genre)}>Tất cả</Link>
          {genres.map((item) => <Link key={item.id} to={`/explore?genre=${item.id}`} className={chipClass(item.id === genreId)}>{item.name}</Link>)}
        </div>

        {!genre ? (
          <>
            <section className="mt-8"><SectionHeading title="Thể loại" /><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{genres.map((item) => <GenreTile key={item.id} genre={item} />)}</div></section>
            <section className="mt-10"><SectionHeading title="Tất cả tuyển tập" /><div className={grid}>{playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}</div></section>
            <section className="mt-10"><SectionHeading title="Tất cả album" /><div className={grid}>{[...store.albums].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).map((album) => <AlbumCard key={album.id} album={album} artistName={getArtist(album.artistId)?.name} onPlay={playAlbum} />)}</div></section>
          </>
        ) : genreTracks.length === 0 ? (
          <div className="mt-8"><EmptyState title={`Chưa có bài hát thuộc ${genre.name}`} description="Thể loại này sẽ có thêm nội dung khi nghệ sĩ phát hành bài mới." /></div>
        ) : (
          <>
            <SongTable songs={genreTracks} showPlays onPlayTrack={(track) => player.playTrack(track, genreTracks)} />
            {genreAlbums.length > 0 && <section className="mt-10"><SectionHeading title="Album" /><div className={grid}>{genreAlbums.map((album) => <AlbumCard key={album.id} album={album} artistName={getArtist(album.artistId)?.name} onPlay={playAlbum} />)}</div></section>}
            {genreArtists.length > 0 && <section className="mt-10"><SectionHeading title="Nghệ sĩ" /><div className={grid}>{genreArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}</div></section>}
            {genrePlaylists.length > 0 && <section className="mt-10"><SectionHeading title="Playlist có thể loại này" /><div className={grid}>{genrePlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} onPlayPlaylist={player.playPlaylist} />)}</div></section>}
          </>
        )}
      </div>
    </div>
  )
}
