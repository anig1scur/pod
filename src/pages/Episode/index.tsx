import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '@/components/Logo';
import FillIn from '@/components/mode/FillIn';
import Player from '@/components/Player';
import Info from '@/components/Info';
import ModeTab from '@/components/ModeTab';
import { Mode, EpisodeData } from '@/types';
import { loadEpisode } from '@/utils/episode';
import { VocabType } from '@/utils/words';
import Dropdown from '@/components/Dropdown';


export type episodeProps = {
  eid?: string;
}

const Episode: FC<episodeProps> = (props) => {

  const pid = useParams()['pid'] || "6mins";
  const eid = props.eid || useParams()['eid'] || "";
  const [audio_url, setAudioUrl] = useState<string>("");
  const [episodeIds, setEpisodeIds] = useState<string[]>([]);
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [curIndex, setCurIndex] = useState<number>(episodeIds.indexOf(eid) < 0 ? 0 : episodeIds.indexOf(eid));
  const [curVocab, setCurVocab] = useState<VocabType>(VocabType.AWL_570);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodeIds = async () => {
      const data = await import(`../../utils/${ pid }.ts`);
      setEpisodeIds(data.episodeIds);
      setCurIndex(data.episodeIds.indexOf(eid) < 0 ? 0 : data.episodeIds.indexOf(eid));
    };
    fetchEpisodeIds();
  }, [pid]);

  useEffect(() => {
    const fetchEpisode = async () => {
      const data = await loadEpisode(pid, episodeIds[curIndex]);
      setEpisodeData(data);
    };
    if (episodeIds.length > 0) {
      console.log(episodeIds, curIndex);
      console.log("fetching episode", episodeIds[curIndex]);
      fetchEpisode();
    }
  }, [episodeIds, curIndex]);

  // useEffect(() => {
  //   navigate(`/${ pid }/${ episodeIds[curIndex] }`)
  // }, [curIndex]);

  useEffect(() => {
    const pod_audio_url = `./assets/${ pid }/audios/${ episodeIds[curIndex] }.mp3`;

    if(episodeData) {
      fetch(pod_audio_url, { method: "HEAD" }).then((res) => {
        // if (res.ok) {
        //   setAudioUrl(pod_audio_url);
        // } else {
          if (episodeData) {
            setAudioUrl(episodeData.audio.replace("http://", "https://"));
          }
        // }
      });
    }

  }, [curIndex, episodeData, pid]);

  if (!episodeData) {
    return null;
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
            last={ episodeIds[curIndex - 1] }
            next={ episodeIds[curIndex + 1] }
            toLast={ () => {
              setCurIndex(curIndex - 1);
            } } toNext={ () => {
              setCurIndex(curIndex + 1);
            } } />
          <Info vocab={ episodeData.vocab } intro={ episodeData.intro } />
        </section>
        <section className="pro">
          <div className="operation">
            <ModeTab type={ Mode.F } />
            <Dropdown options={ Object.values(VocabType) } selected={ curVocab } onSelect={ setCurVocab } />
          </div>
          <FillIn scripts={ episodeData.transcript } vocab={ curVocab } />
        </section>
      </main>
    </div>
  );
};

export default Episode;
