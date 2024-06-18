import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [audio_url, setAudioUrl] = useState<string>("");
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [curIndex, setCurIndex] = useState<number>(id ? episodes.indexOf(id) : 0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisode = async () => {
      const data = await loadEpisode('6mins', episodes[curIndex]);
      setEpisodeData(data);
    };
    fetchEpisode();
  }, [curIndex]);

  useEffect(() => {
    navigate(`/6mins/${ episodes[curIndex] }`)
  }, [curIndex]);

  useEffect(() => {
    //bbc 音频链接被墙了
    const pod_audio_url = `./assets/6mins/audios/${ episodes[curIndex] }.mp3`;

    fetch(pod_audio_url, { method: "HEAD" }).then((res) => {
      if (res.ok) {
        setAudioUrl(pod_audio_url);
      } else {
        if (episodeData) {
          setAudioUrl(episodeData.audio.replace("http://", "https://"));
        }
      }
    });

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
            audio_url={ audio_url }
            peaks={ episodeData.wave_peaks }
            last={ episodes[curIndex - 1] }
            next={ episodes[curIndex + 1] }
            toLast={ () => {
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
