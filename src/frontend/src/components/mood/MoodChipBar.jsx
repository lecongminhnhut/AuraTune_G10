import React from 'react';
import {
  Coffee,
  Zap,
  CloudRain,
  Target,
  BookOpen,
  Flame,
  Moon,
  Compass,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  coffee: Coffee,
  zap: Zap,
  'cloud-rain': CloudRain,
  target: Target,
  'book-open': BookOpen,
  flame: Flame,
  moon: Moon,
  compass: Compass,
};

export default function MoodChipBar({
  tags = [],
  selectedTag = 'chill',
  onSelectTag,
  disabled = false,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" aria-hidden="true" />
          <h2 className="text-base font-bold text-white sm:text-lg">
            Âm nhạc theo Tâm trạng & Ngữ cảnh
          </h2>
        </div>
        <span className="hidden text-xs text-zinc-400 sm:inline-block">
          Chọn chủ đề để nhận danh sách phát và ca khúc phù hợp
        </span>
      </div>

      <div
        role="group"
        aria-label="Danh sách nhãn tâm trạng và ngữ cảnh"
        className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin focus-visible:outline-none"
      >
        {tags.map((tag) => {
          const isSelected = selectedTag === tag.id;
          const IconComponent = ICON_MAP[tag.icon] || Sparkles;

          return (
            <button
              key={tag.id}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onSelectTag?.(tag.id)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 ${
                isSelected
                  ? `bg-gradient-to-r ${tag.color_gradient || 'from-sky-500 to-indigo-600'} text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/30`
                  : 'border border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <IconComponent
                size={14}
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
                aria-hidden="true"
              />
              <span>{tag.label}</span>
              {isSelected && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-white shadow-sm"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
