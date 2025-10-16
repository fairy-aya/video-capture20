/**
 * アップロードエリアコンポーネント
 */

import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function UploadArea() {
  const { videoFile, setVideoFile, setVideoError } = useAppStore();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoError('動画ファイルを選択してください');
        return;
      }
      setVideoFile(file);
    }
  }, [setVideoFile, setVideoError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoError('動画ファイルを選択してください');
        return;
      }
      setVideoFile(file);
    }
  }, [setVideoFile, setVideoError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('video-upload')?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          動画ファイルをドラッグ&ドロップ
        </p>
        <p className="text-xs text-muted-foreground">
          またはクリックしてファイルを選択
        </p>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {videoFile && (
        <div className="text-sm text-muted-foreground">
          選択中: {videoFile.name}
        </div>
      )}
    </div>
  );
}

