/**
 * 等間隔ポイントと任意時刻の計算
 */

export function computeEqualPoints(duration, count) {
  if (!Number.isFinite(duration) || duration <= 0 || count <= 0) {
    return [];
  }
  
  const pts = Array.from({ length: count }, (_, i) => {
    const t = (i * duration) / count;
    // 先頭フレームの重複を避けるため微小オフセット
    return i === 0 ? Math.min(duration, Math.max(0, t + 0.01)) : t;
  });
  
  return pts.map(t => Math.min(duration, Math.max(0, t)));
}

export function normalizeCustomTimes(times, duration) {
  if (!Array.isArray(times) || times.length === 0) {
    return [];
  }
  
  // 範囲内にクリップ
  const clipped = times.map(t => Math.min(duration, Math.max(0, t)));
  
  // 重複排除と昇順ソート
  return Array.from(new Set(clipped)).sort((a, b) => a - b);
}

export function parseCustomTimes(input) {
  if (!input || typeof input !== 'string') {
    return [];
  }
  
  // カンマ区切りで分割し、数値に変換
  return input
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => parseFloat(s))
    .filter(n => !isNaN(n) && n >= 0);
}

