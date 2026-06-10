import { openaiProvider } from './providers/openai';
import { falProvider } from './providers/fal';

/**
 * Sağlayıcıdan bağımsız AI Gateway.
 * İş kodu sağlayıcıyı bilmez; yalnızca bu arayüzle konuşur.
 * Tüm metodlar ilk argüman olarak `brandId` alır (anahtar çözümü + kullanım kaydı için).
 */
export const ai = {
  text: {
    generate: openaiProvider.generateText,
  },
  vision: {
    describe: openaiProvider.describeImage,
  },
  embedding: {
    embed: openaiProvider.embed,
  },
  image: {
    generate: falProvider.generateImage,
  },
  video: {
    generate: falProvider.generateVideo,
  },
};

export { resolveKey, requireKey } from './keys';
export { logUsage, estimateCost } from './usage';
export { prompts } from './prompts';
export type { TextOptions } from './providers/openai';
