import React, { FC, useRef, useCallback, useEffect, Fragment } from 'react';
import { Fragment as FragmentType, Scripts } from '@/types';
import stringSimilarity from 'string-similarity';
import { findMatchedFragment } from '@/utils/episode';
import { WaveFormHandle } from '../WaveForm';

export type dictationProps = {
  scripts: Scripts;
  displayAuthor: boolean;
  words: Set<string>;
  fragments?: FragmentType[];
  audioRef: React.RefObject<WaveFormHandle>;
  pdfBtn?: React.ReactNode;
}

const IGNORED_CHARS = ['.', ',', '!', '?', '(', ')', '[', ']', '{', '}', ':', ';', '"', '\'', '“', '”', '‘', '’', '—', '–', '…', '>', '<', '·', '•', '●', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '|', '\\', '/', '`', '~', ' ', '\n', '\t'];

const pairWordsWithDelimiters = (arr: string[]) => {
  let result = [];
  for (let i = 0;i < arr.length;i += 2) {
    result.push({
      text: arr[i],
      delimiter: arr[i + 1] || ''
    });
  }
  return result;
}


const Dictation: FC<dictationProps> = (props) => {
  const { scripts, words, fragments, displayAuthor = true, audioRef, pdfBtn } = props;
  const userInputs = useRef<HTMLInputElement[]>([]);

  const checkAnswer = useCallback(() => {

    const unifyChars = (str: string | undefined | null) => {
      if (!str) return '';
      return str.toLowerCase().split('').filter(char => !IGNORED_CHARS.includes(char)).join('')
    }
    userInputs.current.forEach(input => {
      const answer = unifyChars(input?.nextElementSibling?.getAttribute('data-answer'));
      const userAnswer = unifyChars(input?.value);
      if (!userAnswer) return;
      const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);
      if (similarity >= 0.85) {
        input.classList.remove('wrong');
        input.classList.add('correct');
      } else {
        input.classList.add('wrong');
        input.classList.remove('correct');
      }
    });
  }, []);


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

  let inputIdx = 0;

  return <div className='mode dictation'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          const matchedFragment = findMatchedFragment(fragments || [], script.text);
          const sentenceWithDelimiters = pairWordsWithDelimiters(script.text.split(/([,;.])/));
          return <div key={ script_index } className='script' onClick={ handleScriptClick } data-begin={ matchedFragment?.begin } data-end={ matchedFragment?.end }>
            { displayAuthor && <h3 title={ script.author }>{ script.author }</h3> }
            <div>{ sentenceWithDelimiters.map((s, sIdx) => {
              let sentence = s.text;
              const wordTotal = sentence.split(' ').length;
              if (!sentence.endsWith('.')) {
                sentence += s.delimiter;
              };
              const wordCount = sentence.split(' ').filter(word => words.has(word)).length;
              if (wordTotal >= 5 && wordTotal <= 28 && wordCount >= 1 || wordCount / wordTotal >= 0.1) {
                return <Fragment key={ sIdx }><input
                  ref={ (ele) => userInputs.current[inputIdx += 1] = ele! }
                  type='text'
                  onClick={ (e) => e.stopPropagation() }
                  onKeyDown={ (e) => {
                    if (e.key === ' ' && !e.ctrlKey) {
                      e.stopPropagation();
                    }
                  } }
                />
                  <label data-answer={ sentence } />
                </Fragment>
              } else {
                return <span key={ sIdx }> { sentence } </span>
              }
            }) }</div>
          </div>
        })
      }
    </div>
    <div className='control' >
      <button onClick={ checkAnswer }>Check</button>
      { pdfBtn }
    </div>
  </div>
}

export default Dictation;
