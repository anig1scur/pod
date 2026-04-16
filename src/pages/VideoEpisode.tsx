import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Player, type PlayerRef } from '@remotion/player';

import Header from '@/components/Header';
import Dropdown from '@/components/Dropdown';
import { PodcastVideo } from '@/remotion/PodcastVideo';
import { REMOTION_DEMO_FPS } from '@/remotion/podcastDemoData';
import { deriveCues, findActiveCueIndex, getEpisodeFragments, type Cue } from '@/remotion/cues';
import { loadEpisode } from '@/utils/episode';
import { loadVocab, VocabType } from '@/utils/words';
import { FullNameMap, podType } from './Episode/list';
import type { EpisodeData } from '@/types';

const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const getAudioUrl = async (pid: podType, eid: string, episodeData: EpisodeData) => {
  const localAudioUrl = withBase(`assets/${pid}/audios/${eid}.mp3`);

  try {
    const res = await fetch(localAudioUrl, { method: 'HEAD' });
    const contentType = res.headers.get('content-type') || '';

    if (res.ok && contentType.includes('audio/')) {
      return localAudioUrl;
    }
  } catch (error) {
    console.error('Local audio probe failed', error);
  }

  return episodeData.audio.replace('http://', 'https://');
};

const translateText = async (text: string) => {
  const response = await fetch('https://translate-serverless.vercel.app/api/translate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      message: text,
      from: 'en',
      to: 'zh',
    }),
  });

  const result = await response.json();
  return result.translation.trans_result.dst as string;
};

const VideoEpisode = () => {
  const { pid, eid } = useParams<{ pid: string; eid: string }>();
  const podcastId = (pid || 'lifekit') as podType;
  const episodeId = eid || '';
  const playerRef = useRef<PlayerRef>(null);
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [curVocab, setCurVocab] = useState<VocabType>(VocabType.AWL_570);
  const [highlightWords, setHighlightWords] = useState<string[]>([]);
  const inFlight = useRef<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const data = await loadEpisode(podcastId, episodeId);

      if (!data || cancelled) {
        return;
      }

      setEpisodeData(data);
      document.title = `${data.title} | Video`;

      const resolvedAudio = await getAudioUrl(podcastId, episodeId, data);

      if (!cancelled) {
        setAudioSrc(resolvedAudio);
      }
    };

    if (episodeId) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [episodeId, podcastId]);

  useEffect(() => {
    let cancelled = false;

    loadVocab(curVocab).then((words) => {
      if (!cancelled) {
        setHighlightWords(words);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [curVocab]);

  const baseCues = useMemo(() => {
    if (!episodeData) {
      return [];
    }

    return deriveCues(getEpisodeFragments(episodeData));
  }, [episodeData]);

  const cues = useMemo(() => {
    return baseCues.map((cue, index) => ({
      ...cue,
      zh: translations[index] || cue.zh,
    }));
  }, [baseCues, translations]);

  const activeCueIndex = useMemo(() => {
    if (cues.length === 0) {
      return 0;
    }

    const found = findActiveCueIndex(cues, currentFrame / REMOTION_DEMO_FPS);
    return found < 0 ? 0 : found;
  }, [cues, currentFrame]);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const onFrameUpdate = ({ detail }: { detail: { frame: number } }) => {
      setCurrentFrame(detail.frame);
    };

    player.addEventListener('frameupdate', onFrameUpdate);
    setCurrentFrame(player.getCurrentFrame());

    return () => {
      player.removeEventListener('frameupdate', onFrameUpdate);
    };
  }, [episodeId, podcastId]);

  useEffect(() => {
    if (cues.length === 0) {
      return;
    }

    const indices = [activeCueIndex - 1, activeCueIndex, activeCueIndex + 1, activeCueIndex + 2]
      .filter((index) => index >= 0 && index < cues.length);

    indices.forEach((index) => {
      const cue = cues[index];
      const cacheKey = `video-translation:${podcastId}:${episodeId}:${index}`;

      if (!cue || cue.zh || inFlight.current.has(index)) {
        return;
      }

      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setTranslations((prev) => (prev[index] ? prev : { ...prev, [index]: cached }));
        return;
      }

      inFlight.current.add(index);

      translateText(cue.en)
        .then((translated) => {
          sessionStorage.setItem(cacheKey, translated);
          setTranslations((prev) => ({ ...prev, [index]: translated }));
        })
        .catch((error) => {
          console.error('Translation error:', error);
        })
        .finally(() => {
          inFlight.current.delete(index);
        });
    });
  }, [activeCueIndex, cues, episodeId, podcastId]);

  if (!episodeData || !audioSrc || cues.length === 0) {
    return (
      <div className="flex flex-col pb-16">
        <Header />
        <main className="mt-10 text-xl">Loading video page...</main>
      </div>
    );
  }

  const durationInFrames = Math.max(1, Math.ceil(episodeData.duration * REMOTION_DEMO_FPS));

  return (
    <div className="flex flex-col pb-16">
      <Header />
      <main className="mt-10 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-3 max-w-5xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em]">
                Dynamic Remotion episode
              </div>
              <h1>{ episodeData.title }</h1>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown options={ Object.values(VocabType) } selected={ curVocab } onSelect={ setCurVocab } />
              <Link
                to={ `/${podcastId}/${episodeId}` }
                className="rounded-full border-[3px] border-black px-5 py-3 text-lg font-semibold transition hover:-translate-y-0.5"
              >
                Read mode
              </Link>
              <a
                href={ episodeData.url }
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-[3px] border-black px-5 py-3 text-lg font-semibold transition hover:-translate-y-0.5"
              >
                Source
              </a>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] border-[3px] border-black bg-black shadow-[0_25px_80px_rgba(0,0,0,0.16)]">
          <Player
            ref={ playerRef }
            component={ PodcastVideo }
            inputProps={ {
              accentColor: '#f97316',
              podcastTitle: FullNameMap[podcastId] || podcastId,
              episodeTitle: episodeData.title,
              cues,
              highlightWords,
              audioSrc,
              imageSrc: episodeData.img,
            } }
            durationInFrames={ durationInFrames }
            fps={ REMOTION_DEMO_FPS }
            compositionWidth={ 1280 }
            compositionHeight={ 850 }
            controls
            style={ {
              width: '100%',
              aspectRatio: '16 / 10.5',
            } }
          />
        </section>
      </main>
    </div>
  );
};

export default VideoEpisode;
