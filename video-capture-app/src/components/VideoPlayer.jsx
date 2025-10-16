/**
 * 動画プレイヤーコンポーネント
 */

import { useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { computeEqualPoints } from '../lib/timepoints';

export function VideoPlayer() {
  const videoRef = useRef(null);
  const {
    videoUrl,
    videoDuration,
    currentTime,
    isPlaying,
    splitCount,
    customTimes,
    setVideoMetadata,
    setVideoError,
    setCurrentTime,
    setIsPlaying
  } = useAppStore();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      setVideoMetadata(video.duration, video.videoWidth, video.videoHeight);
    };

    // 既にメタデータが読み込まれている場合は即座に設定
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    const handleError = () => {
      setVideoError('この動画はブラウザで再生できません');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, setVideoMetadata, setVideoError, setCurrentTime, setIsPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    video.currentTime = percentage * video.duration;
  };

  const handleMarkerClick = (time) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const equalPoints = videoDuration > 0 ? computeEqualPoints(videoDuration, splitCount) : [];
  const allPoints = [...equalPoints, ...customTimes].sort((a, b) => a - b);

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-muted-foreground">動画をアップロードしてください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          preload="metadata"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button onClick={togglePlay} size="sm" variant="outline">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <span className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </span>
        </div>

        <div
          className="relative h-8 bg-muted rounded cursor-pointer"
          onClick={handleSeek}
        >
          {/* 進捗バー */}
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded"
            style={{ width: `${(currentTime / videoDuration) * 100}%` }}
          />

          {/* 等間隔マーカー */}
          {equalPoints.map((point, index) => (
            <div
              key={`equal-${index}`}
              className="absolute top-0 w-1 h-full bg-blue-500 hover:bg-blue-600 cursor-pointer z-10"
              style={{ left: `${(point / videoDuration) * 100}%` }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(point);
              }}
              title={`${point.toFixed(2)}s`}
            />
          ))}

          {/* 任意時刻マーカー */}
          {customTimes.map((point, index) => (
            <div
              key={`custom-${index}`}
              className="absolute top-0 w-1 h-full bg-orange-500 hover:bg-orange-600 cursor-pointer z-10"
              style={{ left: `${(point / videoDuration) * 100}%` }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(point);
              }}
              title={`${point.toFixed(2)}s (任意)`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>等間隔</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" />
            <span>任意</span>
          </div>
        </div>
      </div>
    </div>
  );
}

