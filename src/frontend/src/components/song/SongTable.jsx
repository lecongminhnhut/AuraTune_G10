import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Icon from '../common/Icon.jsx'
import SongRow from './SongRow.jsx'

// editable: cho phép kéo thả / dùng phím mũi tên trên tay nắm để sắp xếp và xóa bài khỏi danh sách.
export default function SongTable({ songs, onPlayTrack, onDownloadTrack, showPlays = false, onRemove, removeLabel, onMove }) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const moveItems = (index) => onMove ? [
    index > 0 && { label: 'Di chuyển lên', icon: ArrowUp, action: () => onMove(index, index - 1) },
    index < songs.length - 1 && { label: 'Di chuyển xuống', icon: ArrowDown, action: () => onMove(index, index + 1) },
  ].filter(Boolean) : undefined

  return (
    <div className="mt-8">
      <div className="grid grid-cols-[28px_minmax(0,1fr)_132px] items-center gap-3 border-b border-white/10 px-3 pb-3 text-[11px] uppercase tracking-wider text-zinc-500 md:grid-cols-[28px_minmax(0,1.8fr)_minmax(120px,1fr)_minmax(90px,.8fr)_132px]">
        <span>#</span><span>Tiêu đề</span><span className="hidden md:block">Album</span><span className="hidden md:block">{showPlays ? 'Lượt nghe' : 'Ngày thêm'}</span><span className="flex justify-end pr-9"><Icon name="clock" size={15} /></span>
      </div>
      <div className="mt-2">
        {songs.map((track, index) => (
          <SongRow
            key={track.id}
            track={track}
            index={index}
            onPlay={onPlayTrack}
            onDownloadTrack={onDownloadTrack}
            showPlays={showPlays}
            onRemove={onRemove ? () => onRemove(track) : undefined}
            removeLabel={removeLabel}
            menuItems={moveItems(index)}
            dragHandleProps={onMove ? {
              tabIndex: 0,
              role: 'button',
              'aria-label': `Sắp xếp ${track.title}. Dùng phím mũi tên lên hoặc xuống để di chuyển`,
              onKeyDown: (event) => {
                if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); onMove(index, index - 1) }
                if (event.key === 'ArrowDown' && index < songs.length - 1) { event.preventDefault(); onMove(index, index + 1) }
              },
            } : undefined}
            rowProps={onMove ? {
              draggable: true,
              onDragStart: (event) => { setDragIndex(index); event.dataTransfer.effectAllowed = 'move' },
              onDragOver: (event) => { event.preventDefault(); setOverIndex(index) },
              onDragEnd: () => { setDragIndex(null); setOverIndex(null) },
              onDrop: (event) => { event.preventDefault(); if (dragIndex !== null && dragIndex !== index) onMove(dragIndex, index); setDragIndex(null); setOverIndex(null) },
              className: `${dragIndex === index ? 'opacity-40' : ''} ${overIndex === index && dragIndex !== index ? 'ring-1 ring-violet-300/50' : ''}`,
            } : undefined}
          />
        ))}
      </div>
    </div>
  )
}
