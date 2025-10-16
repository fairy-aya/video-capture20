/**
 * キャプチャ結果一覧コンポーネント
 */

import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateFileName, downloadBlob, makeZip } from '../lib/zip';
import { Button } from '@/components/ui/button';
import { Download, Archive } from 'lucide-react';

export function CaptureList() {
  const { capturedFrames, outputFormat, filePrefix } = useAppStore();

  const thumbnails = useMemo(() => {
    return capturedFrames.map((frame) => {
      const url = URL.createObjectURL(frame.blob);
      return { ...frame, url };
    });
  }, [capturedFrames]);

  const handleDownload = (frame) => {
    const filename = generateFileName(
      filePrefix,
      frame.index,
      capturedFrames.length,
      outputFormat
    );
    downloadBlob(frame.blob, filename);
  };

  const handleDownloadAll = async () => {
    const items = capturedFrames.map((frame) => {
      const filename = generateFileName(
        filePrefix,
        frame.index,
        capturedFrames.length,
        outputFormat
      );
      return { name: filename, blob: frame.blob };
    });

    try {
      const zipBlob = await makeZip(items);
      downloadBlob(zipBlob, 'captures.zip');
    } catch (error) {
      console.error('ZIP生成エラー:', error);
      alert('ZIP生成中にエラーが発生しました');
    }
  };

  if (capturedFrames.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
        <p className="text-muted-foreground">
          キャプチャ結果がここに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          キャプチャ結果 ({capturedFrames.length}枚)
        </h3>
        <Button onClick={handleDownloadAll} size="sm" variant="outline">
          <Archive className="w-4 h-4 mr-2" />
          ZIPで一括ダウンロード
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {thumbnails.map((frame) => (
          <div
            key={frame.index}
            className="relative group border border-border rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={frame.url}
              alt={`Frame ${frame.index}`}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                onClick={() => handleDownload(frame)}
                size="sm"
                variant="secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                ダウンロード
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
              <div>#{frame.index}</div>
              <div>{frame.time.toFixed(2)}s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

