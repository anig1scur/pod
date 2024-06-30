import React, { FC, useRef, useCallback, useEffect } from 'react';
import { Scripts } from '@/types';
import stringSimilarity from 'string-similarity';

export type dictationProps = {
  scripts: Scripts;
  words: Set<string>;
}

const Dictation: FC<dictationProps> = (props) => {
  const { scripts, words } = props;
  const userInputs = useRef<HTMLInputElement[]>([]);

  const checkAnswer = useCallback(() => {
    userInputs.current.forEach(input => {
      const answer = input.dataset.answer || '';
      const userAnswer = input.value || '';
      const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);
      if (similarity >= 0.8) {
        input.classList.remove('wrong');
        input.classList.add('correct');
      } else {
        input.classList.add('wrong');
        input.classList.remove('correct');
      }
    });
  }, []);

  if (!words || words.size === 0) {
    return <div>Loading...</div>
  }

  return <div className='mode dictation'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          const sentences = script.text.split('. ');
          return <div key={ script_index } className='script'>
            <h3 title={ script.author }>{ script.author }</h3>
            <div>{ sentences.map((sentence, sentence_index) => {
              if(!sentence.endsWith('.')) {
                sentence += '.';
              };
              const wordCount = sentence.split(' ').filter(word => words.has(word)).length;
              if (wordCount >= 2 || wordCount / sentence.split(' ').length >= 0.1) {
                return <input
                    key={ sentence_index }
                    type='text'
                    data-answer={ sentence }
                    onKeyDown={ (e) => {
                      if (e.key === ' ') {
                        e.stopPropagation();
                      }
                    }
                  }
                    ref={ (ele) => userInputs.current[sentence_index] = ele! }
                  />
              } else {
                return <span key={ sentence_index }> { sentence } </span>
              }
            }) }</div>
          </div>
        })
      }
    </div>
    <div className='control' >
      <button onClick={ checkAnswer }>Check</button>
    </div>
  </div>
}

export default Dictation;
