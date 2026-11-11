import React from 'react';
import { Music, Sparkles } from 'lucide-react';

export default function MoodEmptyState({
  tag,
  alternativeSuggestions = [],
  onSelectAlternative,
}) {
  return (
    <div
      data-testid="mood-empty-state"
      className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.05] text-zinc-400">
        <Music size={26} aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-zinc-100 sm:text-lg">
        Hiện chưa có bài hát phù hợp với tâm trạng này
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-zinc-400 sm:text-sm">
        Đội ngũ AuraTune đang tích cực tuyển chọn các giai điệu mới. Bạn có thể khám phá các gợi ý tương tự dưới đây:
      </p>

      {alternativeSuggestions.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <Sparkles size={14} aria-hidden="true" /> Gợi ý thay thế dành cho bạn:
          </span>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {alternativeSuggestions.map((altTag) => (
              <button
                key={altTag}
                type="button"
                onClick={() => onSelectAlternative?.(altTag)}
                className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-semibold text-sky-200 transition-all hover:border-sky-400/60 hover:bg-sky-400/20 active:scale-95"
              >
                #{altTag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
