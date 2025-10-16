/**
 * 任意時刻入力コンポーネント
 */

import { useAppStore } from '../store/useAppStore';
import { parseCustomTimes, normalizeCustomTimes } from '../lib/timepoints';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CustomTimes() {
  const {
    customTimesInput,
    customTimes,
    videoDuration,
    setCustomTimesInput,
    setCustomTimes
  } = useAppStore();

  const handleAdd = () => {
    const parsed = parseCustomTimes(customTimesInput);
    if (parsed.length > 0) {
      const normalized = normalizeCustomTimes(parsed, videoDuration);
      setCustomTimes([...customTimes, ...normalized]);
      setCustomTimesInput('');
    }
  };

  const handleRemove = (index) => {
    setCustomTimes(customTimes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="custom-times">任意の秒数を追加</Label>
      <div className="flex gap-2">
        <Input
          id="custom-times"
          type="text"
          placeholder="例: 1.0, 2.5, 7.2"
          value={customTimesInput}
          onChange={(e) => setCustomTimesInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
        <Button onClick={handleAdd} size="sm">
          追加
        </Button>
      </div>
      {customTimes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {customTimes.map((time, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-sm"
            >
              <span>{time.toFixed(2)}s</span>
              <button
                onClick={() => handleRemove(index)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

