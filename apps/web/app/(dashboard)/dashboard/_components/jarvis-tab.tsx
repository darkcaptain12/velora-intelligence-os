'use client';

import { useFormState } from 'react-dom';
import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jarvisCommand, type JarvisResult } from '../actions';

const jarvisInitialState: JarvisResult = { ok: false, message: '' };

const EXAMPLE_GROUPS = [
  { label: '🔍 Araştır', commands: ['trend avla', 'fırsat bul', 'rakipleri tara', 'tedarikçi bul özel baskılı tişört'] },
  { label: '🏭 Üret', commands: ['ürün zekası üret', 'tasarım üret', 'video üret', 'rapor üret'] },
  { label: '📊 Güncelle', commands: ['finans güncelle', 'seo güncelle', 'talep senkronla', 'reklamları senkronla'] },
  { label: '⚙️ Sistem', commands: ['shopify içe aktar', 'reklam hazırla', 'mail yaz', 'yedek al'] },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRec = any;

export function JarvisTab() {
  const [state, dispatch] = useFormState(jarvisCommand, jarvisInitialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const [listening, setListening] = useState(false);

  const startVoice = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR: AnyRec = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      alert('Tarayıcınız ses tanımayı desteklemiyor.');
      return;
    }
    const rec: AnyRec = new SR();
    rec.lang = 'tr-TR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: AnyRec) => {
      const transcript: string = e.results[0]?.[0]?.transcript ?? '';
      if (transcript && inputRef.current) {
        inputRef.current.value = transcript;
      }
    };
    rec.start();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚡ Jarvis Komut Merkezi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Türkçe komutlarla sistemi yönet. Jarvis komutu anlayıp doğru işi kuyruğa alır.
          </p>
          <form action={dispatch} className="flex gap-2">
            <input
              ref={inputRef}
              name="command"
              placeholder="Komut gir… (ör: 'trend avla', 'video üret', 'yedek al')"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={startVoice}
              title={listening ? 'Dinleniyor…' : 'Sesle komut ver'}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm transition-colors ${
                listening
                  ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-950'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              🎙️
            </button>
            <Button type="submit" size="sm">
              Çalıştır
            </Button>
          </form>
          {state.message && (
            <p
              className={`rounded-md border px-3 py-2 text-sm ${
                state.ok
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                  : 'border-muted bg-muted/50 text-muted-foreground'
              }`}
            >
              {state.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">💡 Örnek Komutlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {EXAMPLE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.commands.map((cmd) => (
                  <form key={cmd} action={dispatch}>
                    <input type="hidden" name="command" value={cmd} />
                    <button
                      type="submit"
                      className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {cmd}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
