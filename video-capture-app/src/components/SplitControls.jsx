/**
 * 分割枚数コントロールコンポーネント
 */

import { useAppStore } from '../store/useAppStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function SplitControls() {
  const { splitCount, setSplitCount } = useAppStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="split-count">分割枚数（枚）</Label>
        <span className="text-sm text-muted-foreground">{splitCount}</span>
      </div>
      <Input
        id="split-count"
        type="range"
        min="5"
        max="200"
        step="1"
        value={splitCount}
        onChange={(e) => setSplitCount(Number(e.target.value))}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        等間隔で生成します。デフォルト20。
      </p>
    </div>
  );
}

