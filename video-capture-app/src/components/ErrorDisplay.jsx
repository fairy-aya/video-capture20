/**
 * エラー表示コンポーネント
 */

import { useAppStore } from '../store/useAppStore';
import { AlertCircle } from 'lucide-react';

export function ErrorDisplay() {
  const { videoError } = useAppStore();

  if (!videoError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{videoError}</p>
    </div>
  );
}

