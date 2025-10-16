/**
 * キャプチャコントロールコンポーネント
 */

import { useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { computeEqualPoints } from '../lib/timepoints';
import { captureSequence } from '../lib/capture';
import { mimeFor } from '../lib/support';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, X } from 'lucide-react';

export function CaptureControls() {
  const videoRef = useRef(null);
  const {
    videoUrl,
    videoDuration,
    splitCount,
    customTimes,
    outputFormat,
    outputQuality,
    isCapturing,
    progress,
    startCapture,
    updateProgress,
    setCapturedFrames,
    finishCapture,
    cancelCapture
  } = useAppStore();

  // 動画要素を取得（非表示の動画要素を使用）
  const getVideoElement = () => {
    if (!videoRef.current) {
      // 既存の動画要素を探す
      const existingVideo = document.querySelector('video');
      if (existingVideo) {
        return existingVideo;
      }
    }
    return videoRef.current;
  };

  const handleCapture = async () => {
    const video = getVideoElement();
    if (!video || !videoUrl) {
      alert('動画が読み込まれていません');
      return;
    }

    // キャプチャポイントを計算
    let points = [];
    if (customTimes.length > 0) {
      // 任意時刻が指定されている場合はそれを使用
      points = [...customTimes].sort((a, b) => a - b);
    } else {
      // 等間隔ポイントを使用
      points = computeEqualPoints(videoDuration, splitCount);
    }

    if (points.length === 0) {
      alert('キャプチャポイントがありません');
      return;
    }

    const controller = new AbortController();
    startCapture(controller, points.length);

    try {
      const type = mimeFor(outputFormat);
      const results = await captureSequence({
        video,
        points,
        type,
        quality: outputQuality,
        concurrency: 3,
        signal: controller.signal,
        onProgress: updateProgress
      });

      setCapturedFrames(results);
      finishCapture();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('キャプチャがキャンセルされました');
      } else {
        console.error('キャプチャエラー:', error);
        alert('キャプチャ中にエラーが発生しました: ' + error.message);
      }
      cancelCapture();
    }
  };

  const canCapture = videoUrl && videoDuration > 0 && !isCapturing;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleCapture}
          disabled={!canCapture}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          生成開始
        </Button>
        {isCapturing && (
          <Button
            onClick={cancelCapture}
            variant="destructive"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            キャンセル
          </Button>
        )}
      </div>

      {isCapturing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">進捗</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}

