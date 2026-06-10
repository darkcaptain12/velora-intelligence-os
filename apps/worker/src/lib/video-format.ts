import type { VideoType } from '@velora/db';

/** Video formatı / şablon yönetimi — her platform için en/boy ve süre. */
export interface VideoFormat {
  aspect: string;
  seconds: number;
  label: string;
}

export const VIDEO_FORMATS: Record<VideoType, VideoFormat> = {
  TIKTOK: { aspect: '9:16', seconds: 15, label: 'TikTok' },
  REEL: { aspect: '9:16', seconds: 20, label: 'Instagram Reel' },
  STORY: { aspect: '9:16', seconds: 10, label: 'Story' },
  UGC: { aspect: '9:16', seconds: 25, label: 'UGC' },
};

/** Tür + kullanıcı prompt'undan Fal video prompt'u kurar. */
export function buildVideoPrompt(type: VideoType, prompt: string): string {
  const fmt = VIDEO_FORMATS[type];
  return `${prompt}. Format: ${fmt.label}, dikey ${fmt.aspect}, ~${fmt.seconds}s, yüksek enerji, mobil için.`;
}
