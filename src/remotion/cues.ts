import type { EpisodeData } from '@/types';

export type BilingualFragment = {
  begin: number;
  end: number;
  en: string;
  zh: string;
};

export type Cue = {
  begin: number;
  end: number;
  en: string;
  zh: string;
};

const splitIntoClauses = (text: string) => {
  return text
    .split(/(?<=[,.;:!?])/g)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

const spreadPartsAcrossSlots = (parts: string[], slotCount: number) => {
  if (parts.length === 0) {
    return new Array(slotCount).fill('');
  }

  return Array.from({ length: slotCount }, (_, index) => {
    const start = Math.floor((index * parts.length) / slotCount);
    const end = Math.floor(((index + 1) * parts.length) / slotCount);
    const safeEnd = Math.max(end, start + 1);
    return parts.slice(start, safeEnd).join(' ').trim();
  });
};

const getCueWeight = (en: string, zh: string) => {
  const englishWeight = en.split(/\s+/).filter(Boolean).length;
  const chineseWeight = zh.replace(/\s+/g, '').length * 0.35;
  return Math.max(englishWeight + chineseWeight, 1);
};

const getTextWeight = (text: string) => {
  return Math.max(text.split(/\s+/).filter(Boolean).length, 1);
};

export const deriveCues = (fragments: BilingualFragment[]): Cue[] => {
  return fragments.flatMap((fragment) => {
    const englishParts = splitIntoClauses(fragment.en);
    const chineseParts = splitIntoClauses(fragment.zh);
    const slotCount = Math.max(englishParts.length, chineseParts.length, 1);
    const normalizedEnglish = spreadPartsAcrossSlots(englishParts, slotCount);
    const normalizedChinese = spreadPartsAcrossSlots(chineseParts, slotCount);
    const weights = normalizedEnglish.map((en, index) => getCueWeight(en, normalizedChinese[index]));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = fragment.begin;

    return normalizedEnglish.map((en, index) => {
      const isLast = index === normalizedEnglish.length - 1;
      const duration = isLast ? fragment.end - cursor : ((fragment.end - fragment.begin) * weights[index]) / totalWeight;
      const cue = {
        begin: cursor,
        end: isLast ? fragment.end : cursor + duration,
        en,
        zh: normalizedChinese[index],
      };
      cursor = cue.end;
      return cue;
    });
  });
};

export const findActiveCueIndex = (cues: Cue[], currentTime: number) => {
  return cues.findIndex((cue) => currentTime >= cue.begin && currentTime < cue.end);
};

export const findActiveCue = (cues: Cue[], currentTime: number) => {
  return cues[findActiveCueIndex(cues, currentTime)] ?? cues[cues.length - 1];
};

const getFragmentsFromTimedTranscript = (episodeData: EpisodeData): BilingualFragment[] => {
  return (episodeData.fragments || []).map((fragment) => ({
    begin: Number(fragment.begin),
    end: Number(fragment.end),
    en: fragment.lines.join(' ').trim(),
    zh: '',
  })).filter((fragment) => fragment.en && fragment.end > fragment.begin);
};

const getFragmentsFromUntimedTranscript = (episodeData: EpisodeData): BilingualFragment[] => {
  const lines = episodeData.transcript
    .map((script) => script.text.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (lines.length === 0 || episodeData.duration <= 0) {
    return [];
  }

  const weights = lines.map(getTextWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;

  return lines.map((line, index) => {
    const isLast = index === lines.length - 1;
    const duration = isLast ? Math.max(episodeData.duration - cursor, 0.1) : (episodeData.duration * weights[index]) / totalWeight;
    const fragment = {
      begin: cursor,
      end: isLast ? episodeData.duration : cursor + duration,
      en: line,
      zh: '',
    };
    cursor = fragment.end;
    return fragment;
  });
};

export const getEpisodeFragments = (episodeData: EpisodeData) => {
  const timedFragments = getFragmentsFromTimedTranscript(episodeData);

  if (timedFragments.length > 0) {
    return timedFragments;
  }

  return getFragmentsFromUntimedTranscript(episodeData);
};
