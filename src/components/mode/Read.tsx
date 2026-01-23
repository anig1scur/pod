import { FC, useEffect, useState } from 'react';
import { Fragment, Scripts } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { WaveFormHandle } from '../WaveForm';
import { splitTextIntoChunks, applyBionicReading, findMatchedFragment } from '@/utils/episode';
export type readProps = {
  scripts: Scripts;
  words: Set<string>;
  displayAuthor: boolean;
  fragments?: Fragment[];
  audioRef: React.RefObject<WaveFormHandle>;
  pdfBtn?: React.ReactNode;
}


export type TranslateRsp = {
  information: string;
  translation: {
    from: string;
    to: string;
    trans_result: {
      dst: string;
      src: string;
    }
  }
}
const Read: FC<readProps> = (props) => {
  const { scripts, words, displayAuthor = true, pdfBtn, fragments, audioRef } = props;
  const [translations, setTranslations] = useState<string[]>([]);
  const [showTranslations, setShowTranslations] = useState<boolean[]>([]);

  const [bionicReading, setBionicReading] = useState(false);

  const handleScriptClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const script = target.closest('.script') as HTMLElement;

    if (!script) return;

    if (script.dataset.begin) {
      audioRef.current?.seekTo(parseInt(script.dataset.begin));
    }
  };

  if (!words || words.size === 0) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    setTranslations(new Array(scripts.length).fill(''));
    setShowTranslations(new Array(scripts.length).fill(true));
  }, [scripts]);

  const handleTranslate = async (text: string, index: number) => {
    if (translations[index]) {
      return;
    };

    try {
      setTranslations(prev => {
        const newTranslations = [...prev];
        newTranslations[index] = 'Translating...';
        return newTranslations;
      });

      const result: TranslateRsp = await fetch('https://translate-serverless.vercel.app/api/translate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          from: 'en',
          to: 'zh',
        }),
      }).then(data => data.json());

      setTranslations(prev => {
        const newTranslations = [...prev];
        newTranslations[index] = result.translation.trans_result.dst;
        return newTranslations;
      });

      setShowTranslations(prev => {
        const newShow = [...prev];
        newShow[index] = true;
        return newShow;
      });
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const toggleTranslation = (index: number) => {
    setShowTranslations(prev => {
      const newShow = [...prev];
      newShow[index] = !newShow[index];
      return newShow;
    });
  };

  return (
    <div className='mode read relative'>
      <div className='controls absolute -top-10 right-0'>
        <label className='flex items-center gap-1 cursor-pointer'>
          <input type='checkbox' checked={ bionicReading } onChange={ () => setBionicReading(!bionicReading) } />
          Bionic Reading
        </label>
      </div>
      <div className='scripts'>
        { scripts.map((script, script_index) => {

          const chunks = splitTextIntoChunks(script.text, 100);
          const matchedFragment = findMatchedFragment(fragments || [], script.text);
          return <div key={ script_index } className='script flex-col cursor-pointer rounded p-2 transition-colors' onClick={ handleScriptClick } data-begin={ matchedFragment?.begin }>
            { displayAuthor && <h3 title={ script.author }>{ script.author }</h3> }
            { chunks.map((chunk, chunk_index) => (
              <div key={ chunk_index } className='my-1 hover:bg-[pink]'>
                { chunk.split(' ').map((word, word_index) => (
                  bionicReading ? <span
                    dangerouslySetInnerHTML={ { __html: applyBionicReading(word) } }
                    key={ `${ chunk_index }-${ word_index }` }
                    className={ words.has(word) ? 'highlight' : '' }
                  /> : <span
                    key={ `${ chunk_index }-${ word_index }` }
                    className={ words.has(word) ? 'highlight' : '' }
                  >
                    { word }{ ' ' }
                  </span>
                )) }
                {
                  chunk_index === chunks.length - 1 &&
                  <span className="translation-controls">
                    <FontAwesomeIcon
                      className='cursor-pointer text-gray-800 mx-2'
                      icon={ faLanguage }
                        onClick={ (e) => {
                          e.stopPropagation();
                          handleTranslate(script.text, script_index);
                        } }
                      title="Translate to Chinese"
                    />
                    <FontAwesomeIcon
                      className='cursor-pointer text-gray-800'
                      icon={ showTranslations[script_index] ? faEye : faEyeSlash }
                        onClick={ (e) => {
                          e.stopPropagation();
                          toggleTranslation(script_index);
                        } }
                      title={ showTranslations[script_index] ? "Hide translation" : "Show translation" }
                    />
                  </span>
                }
              </div>
            )) }
            { translations[script_index] && (
              <div
                className={ `translation ${ showTranslations[script_index] ? '' : 'hidden' }` }
              >
                { translations[script_index] }
              </div>
            ) }
          </div>
        }
        ) }
      </div>
      <div className='control' >
        { pdfBtn }
      </div>
    </div>
  );
}

export default Read;
