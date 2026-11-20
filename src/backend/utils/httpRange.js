// Phân tích header Range cho một tài nguyên có kích thước `size` byte (RFC 9110 §14).
// Trả về:
//   null              -> không có Range hợp lệ, phục vụ toàn bộ tệp với mã 200
//   { start, end }    -> đoạn byte cần trả về với mã 206 (end là vị trí cuối, tính cả)
//   'unsatisfiable'   -> đoạn nằm ngoài tệp, trả về 416
// Chỉ hỗ trợ một đoạn; yêu cầu nhiều đoạn được bỏ qua và phục vụ toàn bộ tệp như RFC cho phép.
export function parseByteRange(header, size) {
  if (typeof header !== 'string') return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === '' && rawEnd === '') return null;

  if (rawStart === '') {
    const suffixLength = Number(rawEnd);
    if (suffixLength === 0 || size === 0) return 'unsatisfiable';
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(rawStart);
  const end = rawEnd === '' ? size - 1 : Math.min(Number(rawEnd), size - 1);
  if (rawEnd !== '' && Number(rawEnd) < start) return null;
  if (start >= size) return 'unsatisfiable';
  return { start, end };
}
