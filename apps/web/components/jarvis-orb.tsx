'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ── Tip tanımları ─────────────────────────────────────────────────────────────

type OrbStatus = 'SLEEP' | 'AWAKE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface OrbState {
  status: OrbStatus;
  lastCommand: string | null;
  lastResult: string | null;
  durationMs: number | null;
  updatedAt: string;
}

const DEFAULT: OrbState = {
  status: 'SLEEP',
  lastCommand: null,
  lastResult: null,
  durationMs: null,
  updatedAt: new Date(0).toISOString(),
};

// ── Durum → görsel harita ──────────────────────────────────────────────────────

const STATE_CONFIG: Record<
  OrbStatus,
  { bg: string; ring: string; icon: string; label: string; animClass: string }
> = {
  SLEEP: {
    bg: 'bg-gray-400',
    ring: '',
    icon: '🤖',
    label: 'Uyku',
    animClass: 'opacity-50',
  },
  AWAKE: {
    bg: 'bg-blue-500',
    ring: 'animate-ping',
    icon: '⚡',
    label: 'Uyandı',
    animClass: '',
  },
  LISTENING: {
    bg: 'bg-blue-600',
    ring: '',
    icon: '🎙️',
    label: 'Dinliyor',
    animClass: 'orb-breathing',
  },
  PROCESSING: {
    bg: 'bg-purple-500',
    ring: 'animate-spin',
    icon: '⚙️',
    label: 'İşleniyor',
    animClass: '',
  },
  SUCCESS: {
    bg: 'bg-green-500',
    ring: '',
    icon: '✓',
    label: 'Tamamlandı',
    animClass: 'orb-glow-once',
  },
  ERROR: {
    bg: 'bg-red-500',
    ring: '',
    icon: '✕',
    label: 'Hata',
    animClass: 'orb-blink-3x',
  },
};

// ── Yardımcı ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number | null): string {
  if (ms == null) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}sn`;
}

// ── Ana component ─────────────────────────────────────────────────────────────

export function JarvisOrb() {
  const [state, setState] = useState<OrbState>(DEFAULT);
  const [showPanel, setShowPanel] = useState(false);
  const prevStatusRef = useRef<OrbStatus>('SLEEP');
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch('/api/jarvis/state', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as OrbState;
      setState((prev) => {
        if (prev.status === data.status && prev.updatedAt === data.updatedAt) return prev;
        return data;
      });
    } catch {
      // ağ hatası → mevcut state koru
    }
  }, []);

  // 2sn polling
  useEffect(() => {
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [poll]);

  // SUCCESS → TTS + 5sn sonra SLEEP; ERROR → 5sn sonra SLEEP
  useEffect(() => {
    const prev = prevStatusRef.current;
    const cur = state.status;
    prevStatusRef.current = cur;

    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (cur === 'SUCCESS' && prev !== 'SUCCESS') {
      sleepTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, status: 'SLEEP' }));
      }, 5000);
    } else if (cur === 'ERROR' && prev !== 'ERROR') {
      sleepTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, status: 'SLEEP' }));
      }, 5000);
    }

    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [state.status, state.lastResult]);

  const cfg = STATE_CONFIG[state.status];
  const tooltipLabel = `Jarvis · Durum: ${cfg.label}${state.lastCommand ? ` · ${state.lastCommand}` : ''}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none" style={{ zIndex: 9999 }}>
      {/* Detail Panel — orb'un üstüne açılır */}
      {showPanel && (
        <div className="mb-3 w-64 rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jarvis
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${cfg.bg}`}
            >
              {cfg.label}
            </span>
          </div>

          {state.lastCommand && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Son Komut</p>
              <p className="text-sm font-medium">{state.lastCommand}</p>
            </div>
          )}

          {state.lastResult && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Sonuç</p>
              <p className="text-sm">{state.lastResult}</p>
            </div>
          )}

          {state.durationMs != null && (
            <div className="mt-2 text-xs text-muted-foreground">
              Süre: {formatDuration(state.durationMs)}
            </div>
          )}

          {state.status === 'SLEEP' && !state.lastCommand && (
            <p className="text-sm text-muted-foreground">Hazır — komut bekleniyor.</p>
          )}
        </div>
      )}

      {/* Orb butonu */}
      <button
        type="button"
        onClick={() => setShowPanel((v) => !v)}
        title={tooltipLabel}
        aria-label={tooltipLabel}
        className="group relative flex h-16 w-16 items-center justify-center md:h-14 md:w-14"
      >
        {/* AWAKE: ping halka */}
        {state.status === 'AWAKE' && (
          <span className={`absolute inset-0 rounded-full ${cfg.bg} animate-ping opacity-60`} />
        )}

        {/* PROCESSING: dönen ince halka */}
        {state.status === 'PROCESSING' && (
          <span className="absolute inset-[-4px] rounded-full animate-spin border-4 border-transparent border-t-purple-400 border-r-purple-400 opacity-80" />
        )}

        {/* Orb gövdesi */}
        <span
          className={`
            relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg
            text-white text-xl font-bold transition-all duration-300
            md:h-12 md:w-12 md:text-lg
            ${cfg.bg} ${cfg.animClass}
          `}
        >
          {cfg.icon}
        </span>

        {/* Hover tooltip (CSS title yerine küçük görsel) */}
        <span
          className="pointer-events-none absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow group-hover:block"
        >
          {cfg.label}
        </span>
      </button>
    </div>
  );
}
