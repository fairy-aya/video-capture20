import { useAppStore } from './store/useAppStore';
import { UploadArea } from './components/UploadArea';
import { VideoPlayer } from './components/VideoPlayer';
import { SplitControls } from './components/SplitControls';
import { CustomTimes } from './components/CustomTimes';
import { OutputPanel } from './components/OutputPanel';
import { CaptureControls } from './components/CaptureControls';
import { CaptureList } from './components/CaptureList';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { RotateCcw, Video } from 'lucide-react';
import './App.css';

function App() {
  const { videoFile, reset } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">動画スクリーンショットキャプチャ</h1>
            </div>
            {videoFile && (
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ErrorDisplay />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* 左カラム: アップロードと設定 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">動画アップロード</h2>
                <UploadArea />
              </div>

              {videoFile && (
                <>
                  <div className="border-t border-border pt-6">
                    <h2 className="text-lg font-semibold mb-4">分割設定</h2>
                    <SplitControls />
                  </div>

                  <div className="border-t border-border pt-6">
                    <h2 className="text-lg font-semibold mb-4">任意時刻</h2>
                    <CustomTimes />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 中央カラム: プレビュー */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
              <VideoPlayer />
            </div>
          </div>

          {/* 右カラム: 出力設定と結果 */}
          <div className="space-y-6">
            {videoFile && (
              <>
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">出力設定</h2>
                    <OutputPanel />
                  </div>

                  <div className="border-t border-border pt-6">
                    <CaptureControls />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">キャプチャ結果</h2>
                  <CaptureList />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 使い方の説明 */}
        {!videoFile && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-muted/50 rounded-lg p-8 space-y-4">
              <h2 className="text-xl font-semibold">使い方</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>動画ファイルをアップロードします</li>
                <li>分割枚数を設定するか、任意の秒数を追加します</li>
                <li>出力形式（PNG/JPEG/WebP）と品質を選択します</li>
                <li>「生成開始」ボタンをクリックしてキャプチャを実行します</li>
                <li>生成された画像を個別にダウンロードするか、ZIPで一括ダウンロードします</li>
              </ol>
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-2">注意事項</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>ブラウザで再生できない動画形式はエラーが表示されます</li>
                  <li>WebPはブラウザが対応している場合のみ選択可能です</li>
                  <li>シーク時の時間精度はキーフレームに依存するため、±数十msのズレが生じる場合があります</li>
                  <li>長時間の動画や大量のキャプチャを行う場合、メモリ使用量にご注意ください</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          動画スクリーンショットキャプチャ - ブラウザで動画から等間隔スクリーンショットを生成
        </div>
      </footer>
    </div>
  );
}

export default App;

