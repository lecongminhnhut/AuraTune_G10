import React from 'react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { Link, navigate } from '../../utils/navigation.jsx';

export default function MoodDegradedBanner({
  message = 'Hệ thống gợi ý AI đang bận. Đang hiển thị danh sách phát tâm trạng phổ biến.',
  fallbackShortcuts = [],
}) {
  return (
    <div
      role="status"
      data-testid="mood-degraded-banner"
      className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle size={18} className="shrink-0 text-amber-400" aria-hidden="true" />
        <span className="text-xs font-medium text-amber-200 sm:text-sm">
          {message}
        </span>
      </div>

      {fallbackShortcuts?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {fallbackShortcuts.map((shortcut, idx) => (
            <Link
              key={idx}
              href={shortcut.target_url}
              onClick={(e) => {
                e.preventDefault();
                navigate(shortcut.target_url);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-400/25"
            >
              <span>{shortcut.title}</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
