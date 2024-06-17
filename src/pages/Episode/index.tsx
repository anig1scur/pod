import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import FillIn from '@/components/mode/FillIn';
import Player from '@/components/Player';
import Info from '@/components/Info';
import ModeTab from '@/components/ModeTab';
import { Mode, EpisodeData } from '@/types';
import { loadEpisode } from '@/utils/episode';
import { episodes } from "@/utils/6min";

const Episode = () => {
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [curIndex, setCurIndex] = useState<number>(episodes.length - 1);
  const [lastNext, setLastNext] = useState<{
    last?: string;
    next?: string;
  }>({});

  useEffect(() => {
    const fetchEpisode = async () => {
      const data = await loadEpisode('6mins', episodes[curIndex]);
      setEpisodeData(data);
    };
    fetchEpisode();
  }, [curIndex]);

  useEffect(() => {
    const last = episodes[curIndex - 1];
    const next = episodes[curIndex + 1];
    setLastNext({ last, next });
  }, [curIndex]);


  if (!episodeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="episode">
      <header>
        <Logo text="POD!" />
      </header>
      <main>
        <section className="meta">
          <h1>{ episodeData.title }</h1>
          <Player audio_url={ episodeData.audio.replace("http://", "https://") } { ...lastNext } toLast={ () => {
            setCurIndex(curIndex - 1);
          } } toNext={ () => {
            setCurIndex(curIndex + 1);

          } } />
          <Info vocab={ episodeData.vocab } intro={ episodeData.intro } />
        </section>
        <section className="pro">
          <ModeTab type={ Mode.F } />
          <FillIn scripts={ episodeData.transcript } />
        </section>
      </main>
    </div>
  );
};

export default Episode;
