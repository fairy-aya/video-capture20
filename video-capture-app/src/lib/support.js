/**
 * ブラウザ対応判定とMIMEタイプ変換
 */

export function mimeFor(ext) {
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

export function supportsWebP() {
  const canvas = document.createElement('canvas');
  if (!canvas.toDataURL) return false;
  const dataUrl = canvas.toDataURL('image/webp');
  return dataUrl.startsWith('data:image/webp');
}

export function getSupportedFormats() {
  const formats = [
    { value: 'png', label: 'PNG', mime: 'image/png' },
    { value: 'jpeg', label: 'JPEG', mime: 'image/jpeg' }
  ];
  
  if (supportsWebP()) {
    formats.push({ value: 'webp', label: 'WebP', mime: 'image/webp' });
  }
  
  return formats;
}

