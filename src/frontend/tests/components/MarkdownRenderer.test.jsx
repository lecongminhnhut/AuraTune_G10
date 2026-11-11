import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MarkdownRenderer, { sanitizeUrl } from '../../src/components/chat/MarkdownRenderer.jsx'

describe('MarkdownRenderer (T017 - US2 Markdown Unit Tests - FR-007)', () => {
  describe('sanitizeUrl', () => {
    test('allows safe http and https URLs', () => {
      assert.equal(sanitizeUrl('https://auratune.vn'), 'https://auratune.vn')
      assert.equal(sanitizeUrl('http://localhost:5173/charts'), 'http://localhost:5173/charts')
    });

    test('allows internal relative paths starting with /', () => {
      assert.equal(sanitizeUrl('/library'), '/library')
      assert.equal(sanitizeUrl('/charts?genre=lofi'), '/charts?genre=lofi')
    });

    test('sanitizes malicious javascript: or data: URLs to #', () => {
      assert.equal(sanitizeUrl('javascript:alert(document.cookie)'), '#')
      assert.equal(sanitizeUrl('JAVASCRIPT:alert(1)'), '#')
      assert.equal(sanitizeUrl('data:text/html;base64,PHNjcmlwdD4='), '#')
      assert.equal(sanitizeUrl('vbscript:msgbox(1)'), '#')
    });

    test('handles empty or non-string inputs safely', () => {
      assert.equal(sanitizeUrl(''), '#')
      assert.equal(sanitizeUrl(null), '#')
      assert.equal(sanitizeUrl(undefined), '#')
    });
  });

  describe('Component Rendering', () => {
    test('renders bold and italic formatting correctly', () => {
      const content = 'Đây là **chữ đậm** và *chữ nghiêng*.'
      const html = renderToStaticMarkup(<MarkdownRenderer content={content} />)
      assert.ok(html.includes('<strong class="font-bold text-white">chữ đậm</strong>'))
      assert.ok(html.includes('<em class="italic text-zinc-200">chữ nghiêng</em>'))
    });

    test('renders inline code and fenced code blocks', () => {
      const content = 'Sử dụng lệnh `npm run dev` để chạy:\n```bash\nnpm install\nnpm run dev\n```'
      const html = renderToStaticMarkup(<MarkdownRenderer content={content} />)
      assert.ok(html.includes('<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-sky-200">npm run dev</code>'))
      assert.ok(html.includes('<pre class="my-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-2.5 font-mono text-[11px] text-zinc-300"><code>npm install\nnpm run dev</code></pre>'))
    });

    test('renders unordered and ordered lists', () => {
      const content = '- Mục 1\n- Mục 2\n\n1. Thứ tự 1\n2. Thứ tự 2'
      const html = renderToStaticMarkup(<MarkdownRenderer content={content} />)
      assert.ok(html.includes('<ul class="my-1.5 list-disc space-y-1 pl-5">'))
      assert.ok(html.includes('<li>Mục 1</li>'))
      assert.ok(html.includes('<li>Mục 2</li>'))
      assert.ok(html.includes('<ol class="my-1.5 list-decimal space-y-1 pl-5">'))
      assert.ok(html.includes('<li>Thứ tự 1</li>'))
      assert.ok(html.includes('<li>Thứ tự 2</li>'))
    });

    test('renders safe links with target="_blank" and rel="noopener noreferrer"', () => {
      const content = 'Truy cập [Trang chủ](/explore) hoặc [AuraTune](https://auratune.vn)'
      const html = renderToStaticMarkup(<MarkdownRenderer content={content} />)
      assert.ok(html.includes('href="/explore"'))
      assert.ok(html.includes('href="https://auratune.vn"'))
      assert.ok(html.includes('target="_blank"'))
      assert.ok(html.includes('rel="noopener noreferrer"'))
    });

    test('strips dangerous href from javascript links and renders label safely', () => {
      const malicious = '[Click me](javascript:alert("hacked"))'
      const html = renderToStaticMarkup(<MarkdownRenderer content={malicious} />)
      assert.ok(!html.includes('javascript:'))
      assert.ok(html.includes('Click me'))
    });
  });
});
