import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from '@/components/Logo';
import FillIn from '@/components/mode/FillIn';
import Player from '@/components/Player';
import Info from '@/components/Info';
import ModeTab from '@/components/ModeTab';
import { Mode, EpisodeData } from '@/types';
import { loadEpisode } from '@/utils/episode';
import { episodes } from "@/utils/6min";


export type episodeProps = {
  id?: string;
}

const Episode: FC<episodeProps> = (props) => {

  const id = props.id || useParams()['id'];

  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [curIndex, setCurIndex] = useState<number>(0);
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
    if (id) {
      setCurIndex(episodes.indexOf(id));
    }
  }, [id])

  //bbc 音频链接被墙了
  const pod_audio_url = `/assets/6mins/audios/${ episodes[curIndex] }.mp3`;

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
          <Player
            peaks={ episodeData.wave_peaks }
            audio_url={ pod_audio_url } { ...lastNext } toLast={ () => {
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
