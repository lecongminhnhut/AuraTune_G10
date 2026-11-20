import React from 'react';
import Icon from '../common/Icon.jsx';

/**
 * FallbackNoticeBanner (Feature 102 - T026, FR-006, EF-01)
 * Subtle notification banner displayed above the recommendation grid
 * when the AI service is experiencing downtime or degraded to popular content.
 */
export default function FallbackNoticeBanner({ message, onDismiss }) {
  const displayMessage =
    message || 'Hiển thị nội dung thịnh hành do hệ thống gợi ý đang bảo trì';

  return (
    <aside
      role="status"
      aria-live="polite"
      className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3.5 py-2.5 text-xs text-amber-200 backdrop-blur-sm transition-all animate-fade-in"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
          <Icon name="spark" size={13} />
        </span>
        <span className="truncate">{displayMessage}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-amber-300/70 hover:text-amber-200 p-1"
          aria-label="Đóng thông báo"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </aside>
  );
}
