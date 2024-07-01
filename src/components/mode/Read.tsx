import { FC, useEffect, useState } from 'react';
import { Scripts } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export type readProps = {
  scripts: Scripts;
  words: Set<string>;
  displayAuthor: boolean;
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
  const { scripts, words, displayAuthor = true } = props;
  const [translations, setTranslations] = useState<string[]>([]);
  const [showTranslations, setShowTranslations] = useState<boolean[]>([]);

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
    <div className='mode read'>
      <div className='scripts'>
        { scripts.map((script, script_index) => (
          <div key={ script_index } className='script flex-col'>
            { displayAuthor && <h3 title={ script.author }>{ script.author }</h3> }
            <div>
              { script.text.split(' ').map((word, word_index) => (
                words.has(word)
                  ? <span key={ word_index } className='highlight'>{ word } </span>
                  : <span key={ word_index }>{ word } </span>
              )) }
              <span className="translation-controls">
                <FontAwesomeIcon
                  className='cursor-pointer text-gray-800 mx-2'
                  icon={ faLanguage }
                  onClick={ () => handleTranslate(script.text, script_index) }
                  title="Translate to Chinese"
                />
                <FontAwesomeIcon
                  className='cursor-pointer text-gray-800'
                  icon={ showTranslations[script_index] ? faEye : faEyeSlash }
                  onClick={ () => toggleTranslation(script_index) }
                  title={ showTranslations[script_index] ? "Hide translation" : "Show translation" }
                />
              </span>
            </div>
            { translations[script_index] && (
              <div
                className={ `translation ${ showTranslations[script_index] ? '' : 'hidden' }` }
              >
                { translations[script_index] }
              </div>
            ) }
          </div>
        )) }
      </div>
    </div>
  );
}

export default Read;