'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type JobState = 'idle' | 'queued' | 'running' | 'success' | 'failed';

export function SampleJobRunner() {
  const [message, setMessage] = useState('Merhaba VELORA');
  const [state, setState] = useState<JobState>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  async function run() {
    setError(null);
    setResult(null);
    setState('queued');

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!data.ok) {
      setState('failed');
      setError(data.error ?? 'İş kuyruğa eklenemedi');
      return;
    }

    const jobId = data.jobId as string;
    stopPolling();
    pollRef.current = setInterval(async () => {
      const sres = await fetch(`/api/jobs?id=${encodeURIComponent(jobId)}`);
      const sdata = await sres.json();
      if (!sdata.ok) return;
      if (sdata.state === 'active') setState('running');
      if (sdata.state === 'completed') {
        stopPolling();
        setState('success');
        setResult(JSON.stringify(sdata.result));
      }
      if (sdata.state === 'failed') {
        stopPolling();
        setState('failed');
        setError(sdata.failedReason ?? 'İş başarısız');
      }
    }, 800);
  }

  const busy = state === 'queued' || state === 'running';

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Test mesajı"
          disabled={busy}
        />
        <Button onClick={run} disabled={busy || message.length === 0}>
          {busy ? 'Çalışıyor...' : 'İşi Çalıştır'}
        </Button>
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Durum: </span>
        <span className="font-medium">{state}</span>
      </div>
      {result && (
        <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{result}</pre>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
