import { EpisodeData } from '@/types';

export const loadEpisode = async (type: string, fname: string): Promise<EpisodeData> => {
  let content;
  let file = `/assets/${ type }/scripts/${ fname }.json`;

  try {
    const res = await fetch(file);
    const text = await res.text();

    content = JSON.parse(text);
  } catch (error) {
    console.error("Failed to load Episode", error);
  }

  return content;
}
