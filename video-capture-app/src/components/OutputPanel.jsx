/**
 * 出力設定パネルコンポーネント
 */

import { useAppStore } from '../store/useAppStore';
import { getSupportedFormats } from '../lib/support';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function OutputPanel() {
  const {
    outputFormat,
    outputQuality,
    filePrefix,
    setOutputFormat,
    setOutputQuality,
    setFilePrefix
  } = useAppStore();

  const supportedFormats = getSupportedFormats();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="output-format">出力形式</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger id="output-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedFormats.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="output-quality">品質</Label>
          <span className="text-sm text-muted-foreground">
            {outputQuality.toFixed(2)}
          </span>
        </div>
        <Input
          id="output-quality"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={outputQuality}
          onChange={(e) => setOutputQuality(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-prefix">ファイル名プレフィックス</Label>
        <Input
          id="file-prefix"
          type="text"
          value={filePrefix}
          onChange={(e) => setFilePrefix(e.target.value)}
          placeholder="capture"
        />
      </div>
    </div>
  );
}

