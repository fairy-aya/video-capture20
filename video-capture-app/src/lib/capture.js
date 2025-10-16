/**
 * 動画キャプチャロジック（並列処理、進捗表示、キャンセル対応）
 */

export async function captureAt(video, timeSec, type, quality = 0.92, signal) {
  if (signal?.aborted) {
    throw new DOMException('aborted', 'AbortError');
  }

  // 指定時刻にシーク
  video.currentTime = timeSec;

  // seekedイベントを待つ
  await new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('aborted', 'AbortError'));
    }

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };

    video.addEventListener('seeked', onSeeked, { once: true });
  });

  // 次の描画フレームまで待つ
  await new Promise((resolve) => {
    if (video.requestVideoFrameCallback) {
      video.requestVideoFrameCallback(() => resolve());
    } else {
      requestAnimationFrame(() => resolve());
    }
  });

  // キャンバスに描画
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Blobに変換
  return await new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('aborted', 'AbortError'));
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('toBlob failed'));
        }
      },
      type,
      quality
    );
  });
}

export async function captureSequence({
  video,
  points,
  type,
  quality = 0.92,
  concurrency = 3,
  signal,
  onProgress
}) {
  console.log('captureSequence started:', {
    pointsCount: points.length,
    type,
    quality,
    concurrency
  });
  
  const results = [];
  let currentIndex = 0;
  let completedCount = 0;

  async function worker() {
    while (currentIndex < points.length && !signal?.aborted) {
      const idx = currentIndex++;
      const timeSec = points[idx];

      try {
        const blob = await captureAt(video, timeSec, type, quality, signal);
        results[idx] = {
          index: idx + 1,
          time: timeSec,
          blob
        };
        completedCount++;
        onProgress?.(completedCount, points.length);
      } catch (error) {
        if (error.name === 'AbortError') {
          throw error;
        }
        // その他のエラーは記録して続行
        console.error(`Failed to capture at ${timeSec}s:`, error);
        results[idx] = {
          index: idx + 1,
          time: timeSec,
          error: error.message
        };
        completedCount++;
        onProgress?.(completedCount, points.length);
      }
    }
  }

  const workerCount = Math.min(concurrency, points.length);
  const workers = Array.from({ length: workerCount }, () => worker());

  await Promise.allSettled(workers);

  if (signal?.aborted) {
    throw new DOMException('aborted', 'AbortError');
  }

  // エラーがあったものを除外
  return results.filter(r => r && r.blob);
}

