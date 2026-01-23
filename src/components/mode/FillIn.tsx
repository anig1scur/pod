import React, { FC, ReactNode, useCallback, useRef } from 'react';
import { Fragment, Scripts } from '@/types';
import { WaveFormHandle } from '../WaveForm';
import { findMatchedFragment } from '@/utils/episode';

export type fillInProps = {
  words: Set<string>;
  scripts: Scripts;
  displayAuthor: boolean;
  fragments?: Fragment[];
  audioRef: React.RefObject<WaveFormHandle>;
  pdfBtn?: ReactNode;
}


const FillIn: FC<fillInProps> = (props) => {
  const { scripts, words, pdfBtn, displayAuthor = true, audioRef, fragments } = props;
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const blanks = useRef<HTMLSpanElement[]>([]);

  const handleScriptClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const script = target.closest('.script') as HTMLElement;

    if (!script) return;

    if (script.dataset.begin) {
      audioRef.current?.seekTo(parseInt(script.dataset.begin));
    }
  };

  const checkAnswer = useCallback(() => {
    blanks.current.forEach(element => {
      const answer = element.dataset.answer;
      const inputs = element.querySelectorAll('input');
      const userAnswer = Array.from(inputs).map(input => input.value).join('');
      if (answer === userAnswer) {
        element.classList.remove("wrong");
        element.classList.add("correct");
      } else {
        element.classList.add('wrong');
        element.classList.remove('correct');
      }
    });
  }, [blanks.current]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const index = parseInt(e.currentTarget.dataset.index || '0');
    const isLetter = /^[a-zA-Z\-]$/;

    if (e.ctrlKey) {
      return;
    }

    e.preventDefault();

    if (e.key === 'Backspace') {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = '';
      }
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else if (isLetter.test(e.key)) {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = e.key;
      }
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      inputRefs.current[index].value = '';
    }
  }, []);

  let cur = 0;
  let qNum = 0;

  if (!words || words.size === 0) {
    return <div>Loading...</div>
  }

  return <div className='mode fill_in'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          const matchedFragment = findMatchedFragment(fragments || [], script.text);
          return <div key={ script_index } className='script cursor-pointer rounded p-2 transition-colors' onClick={ handleScriptClick } data-begin={ matchedFragment?.begin }>
            { displayAuthor && <h3 title={ script.author }>{ script.author }</h3> }
            <div className="hover:bg-[pink]">{ script.text.split(' ').map((word, word_index) => {
              if (words.has(word)) {
                const el = <div className="blank"
                  key={ word_index }
                  data-answer={ word }
                  ref={ (ele) => blanks.current[qNum += 1] = ele! } >
                  { Array.from(
                    { length: word.length }).map((_, index) => {
                      const now = cur + index;
                      return <input
                        key={ index }
                        maxLength={ 1 }
                        data-index={ now }
                        onKeyDown={ (e) => handleKeyDown(e) }
                        onClick={ (e) => e.stopPropagation() }
                        type='text'
                        ref={ (ele) => inputRefs.current[now] = ele! }
                      />
                    })
                  }
                </div>;
                cur += word.length;
                return el;
              } else {
                return <span key={ word_index }> { word } </span>
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


export default FillIn;
