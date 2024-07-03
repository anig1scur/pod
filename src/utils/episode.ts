import { EpisodeData } from '@/types';

export const loadEpisode = async (type: string, fname: string): Promise<EpisodeData> => {
  let content;
  let file = `./assets/${ type }/scripts/${ fname }.json`;

  try {
    const res = await fetch(file);
    const text = await res.text();

    content = JSON.parse(text);
  } catch (error) {
    console.error("Failed to load Episode", error);
  }

  return content;
}


export function groupBy<T, K extends keyof T>(list: T[], key: K): Map<T[K], T[]> {
  return list.reduce((acc, cur) => {
    const group = cur[key];
    const values = acc.get(group) || [];
    values.push(cur);
    acc.set(group, values);
    return acc;
  }, new Map());
}

export const splitTextIntoChunks = (text: string, targetWordCount: number) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks = [];
  let currentChunk = '';
  let wordCount = 0;

  for (const sentence of sentences) {
    const sentenceWordCount = sentence.trim().split(/\s+/).length;

    if (wordCount + sentenceWordCount > targetWordCount && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
      wordCount = 0;
    }

    currentChunk += sentence + ' ';
    wordCount += sentenceWordCount;
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};


export const applyBionicReading = (text: string): string => {
  return text.split(' ').map(word => {
    const splitIndex = Math.ceil(word.length / 2);
    return `<b>${word.slice(0, splitIndex)}</b>${word.slice(splitIndex)} `;
  }).join(' ');
};
