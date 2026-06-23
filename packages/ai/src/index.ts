import { openaiProvider } from './providers/openai';
import { falProvider } from './providers/fal';
import { claudeProvider } from './providers/claude';

/**
 * Sağlayıcıdan bağımsız AI Gateway.
 * İş kodu sağlayıcıyı bilmez; yalnızca bu arayüzle konuşur.
 * Tüm metodlar ilk argüman olarak `brandId` alır (anahtar çözümü + kullanım kaydı için).
 */
export const ai = {
  text: {
    generate: openaiProvider.generateText,
    claude: claudeProvider.generateText,
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
  search: {
    web: openaiProvider.searchWeb,
  },
};

export { resolveKey, requireKey } from './keys';
export { logUsage, estimateCost } from './usage';
export { prompts } from './prompts';
export type { TextOptions, WebSearchResult } from './providers/openai';
