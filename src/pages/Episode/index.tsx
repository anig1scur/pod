import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import FillIn from '@/components/mode/FillIn';
import Dictation from '@/components/mode/Dictation';
import Read from '@/components/mode/Read';
import Player from '@/components/Player';
import Info from '@/components/Info';
import ModeTab from '@/components/ModeTab';
import { Mode, EpisodeData } from '@/types';
import { loadEpisode, groupBy } from '@/utils/episode';
import { loadVocab, VocabType } from '@/utils/words';
import Dropdown from '@/components/Dropdown';
import { podType } from './list';

// for skip template intro audio
const START_TIME_MAP = new Map<podType, number>([
  // [podType.sixmins, 7],
]);

export type episodeProps = {
  eid?: string;
}

const Episode: FC<episodeProps> = (props) => {

  const pid = (useParams()['pid'] || "6mins") as podType;
  const eid = props.eid || useParams()['eid'] || "";
  const [mode, setMode] = useState<Mode>(Mode.F);
  const [audio_url, setAudioUrl] = useState<string>("");
  const [episodeIds, setEpisodeIds] = useState<string[]>([]);
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [curIndex, setCurIndex] = useState<number>(episodeIds.indexOf(eid) < 0 ? 0 : episodeIds.indexOf(eid));
  const [curVocab, setCurVocab] = useState<VocabType>(VocabType.AWL_570);
  const [words, setWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchWords = async () => {
      const fetchedWords = await loadVocab(curVocab || 'C1');
      setWords(new Set(fetchedWords));
    };

    fetchWords();
  }, [curVocab]);

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
      fetchEpisode();
    }
  }, [episodeIds, curIndex]);

  useEffect(() => {
    if (episodeIds.length > 0) {
      navigate(`/${ pid }/${ episodeIds[curIndex] }`)
    }
  }, [curIndex]);

  useEffect(() => {
    const pod_audio_url = `./assets/${ pid }/audios/${ episodeIds[curIndex] }.mp3`;

    if (episodeData) {
      fetch(pod_audio_url, { method: "HEAD" }).then((res) => {
        if (res.ok) {
          setAudioUrl(pod_audio_url);
        } else {
          if (episodeData) {
            setAudioUrl(episodeData.audio.replace("http://", "https://"));
          }
        }
      });
    }

  }, [curIndex, episodeData, pid]);

  if (!episodeData) {
    return null;
  }

  return (
    <div className="episode">
      <Header />
      <main className='mt-10'>
        <section className="meta">
          <h1><a target='_blank' className='
          hover:outline-dashed hover:outline-[#D93D86] hover:outline-4 pb-2 inline-block
          ' href={ episodeData.url }>{ episodeData.title }</a></h1>
          {/* FIXME: the start time of sciam is not regular */ }
          <Player
            start_time={ START_TIME_MAP.get(pid) || 0 }
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
            <ModeTab type={ mode } onChange={ setMode } />
            <Dropdown options={ Object.values(VocabType) } selected={ curVocab } onSelect={ setCurVocab } />
          </div>
          {
            (() => {
              const { authors, transcript } = episodeData;

              const hideAuthor = authors.length <= 1 || groupBy(transcript, 'author').size <= 1;
              const props = {
                scripts: episodeData.transcript,
                words: words,
                displayAuthor: !hideAuthor,
              }
              switch (mode) {
                case Mode.F:
                  return <FillIn { ...props } />;
                case Mode.D:
                  return <Dictation { ...props } />;
                case Mode.R:
                  return <Read { ...props } />;
                default:
                  return null;
              }
            })()
          }
        </section>
      </main>
    </div>
  );
};

export default Episode;
