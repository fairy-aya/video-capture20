/**
 * ZIP生成ロジック
 */

import JSZip from 'jszip';

export async function makeZip(items, zipName = 'captures.zip') {
  const zip = new JSZip();
  
  items.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });
  
  return await zip.generateAsync({ type: 'blob' });
}

export function generateFileName(prefix, index, totalCount, extension) {
  // 総数に応じたゼロ埋め桁数を決定
  const digits = String(totalCount).length;
  const paddedIndex = String(index).padStart(digits, '0');
  
  return `${prefix}_${paddedIndex}.${extension}`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

