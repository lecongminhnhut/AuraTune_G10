import React from 'react';

/**
 * Validates and sanitizes a link URL to prevent XSS.
 * Only allows http:, https:, or relative paths starting with /
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  // Disallow javascript:, data:, vbscript: etc.
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  if (/^(https?:\/\/|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

/**
 * Tokenizes inline Markdown into React nodes:
 * - Bold: **text**
 * - Italic: *text*
 * - Inline code: `text`
 * - Link: [text](url)
 */
export function renderInlineMarkdown(text) {
  if (!text) return null;

  // Regex to match inline tokens:
  // 1: `code`
  // 2: **bold**
  // 3: *italic*
  // 4: [text](url)
  const tokenRegex = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      elements.push(text.slice(lastIndex, matchIndex));
    }

    if (match[1]) {
      // Inline code
      elements.push(
        <code
          key={`code-${matchIndex}`}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-sky-200"
        >
          {match[2]}
        </code>
      );
    } else if (match[3]) {
      // Bold
      elements.push(
        <strong key={`bold-${matchIndex}`} className="font-bold text-white">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // Italic
      elements.push(
        <em key={`italic-${matchIndex}`} className="italic text-zinc-200">
          {match[6]}
        </em>
      );
    } else if (match[7]) {
      // Link
      const label = match[8];
      const rawUrl = match[9];
      const safeHref = sanitizeUrl(rawUrl);

      if (safeHref === '#') {
        elements.push(<span key={`link-safe-${matchIndex}`}>{label}</span>);
      } else {
        elements.push(
          <a
            key={`link-${matchIndex}`}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 underline underline-offset-2 transition hover:text-sky-200"
          >
            {label}
          </a>
        );
      }
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

/**
 * Safe Markdown Renderer component for AI responses (FR-007)
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let currentList = null;
  let codeBlock = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="my-1.5 list-disc space-y-1 pl-5">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{renderInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        blocks.push(
          <ol key={`ol-${blocks.length}`} className="my-1.5 list-decimal space-y-1 pl-5">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{renderInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fence
    if (line.trim().startsWith('```')) {
      if (codeBlock) {
        // End code block
        blocks.push(
          <pre
            key={`codeblock-${blocks.length}`}
            className="my-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-2.5 font-mono text-[11px] text-zinc-300"
          >
            <code>{codeBlock.lines.join('\n')}</code>
          </pre>
        );
        codeBlock = null;
      } else {
        flushList();
        codeBlock = { lines: [] };
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.lines.push(line);
      continue;
    }

    // Check unordered list item
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Check ordered list item
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Empty line separates blocks
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Normal paragraph line
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-1">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  flushList();

  if (codeBlock) {
    blocks.push(
      <pre
        key={`codeblock-${blocks.length}`}
        className="my-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-2.5 font-mono text-[11px] text-zinc-300"
      >
        <code>{codeBlock.lines.join('\n')}</code>
      </pre>
    );
  }

  return (
    <div className={`markdown-content font-sans text-[13px] leading-[1.75] text-zinc-200 ${className}`}>
      {blocks}
    </div>
  );
}
