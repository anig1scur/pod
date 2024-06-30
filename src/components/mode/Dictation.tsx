import React, { FC, useRef, useCallback, useEffect } from 'react';
import { Scripts } from '@/types';
import stringSimilarity from 'string-similarity';

export type dictationProps = {
  scripts: Scripts;
  words: Set<string>;
}

const IGNORED_CHARS = ['.', ',', '!', '?', '(', ')', '[', ']', '{', '}', ':', ';', '"', '\'', '“', '”', '‘', '’', '—', '–', '…', '>', '<', '·', '•', '●', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '|', '\\', '/', '`', '~', ' ', '\n', '\t'];

const Dictation: FC<dictationProps> = (props) => {
  const { scripts, words } = props;
  const userInputs = useRef<HTMLInputElement[]>([]);

  const checkAnswer = useCallback(() => {

    const unifyChars = (str: string | undefined | null) => {
      if (!str) return '';
      return str.toLowerCase().split('').filter(char => !IGNORED_CHARS.includes(char)).join('')
    }
    userInputs.current.forEach(input => {
      const answer = unifyChars(input.parentElement?.querySelector('label')?.getAttribute('data-answer'));
      const userAnswer = unifyChars(input.value);
      if (!userAnswer) return;

      const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);
      if (similarity >= 0.95) {
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

  let inputIdx = 0;

  return <div className='mode dictation'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          const sentences = script.text.split('. ');
          return <div key={ script_index } className='script'>
            <h3 title={ script.author }>{ script.author }</h3>
            <div>{ sentences.map((sentence, sIdx) => {
              const wordTotal = sentence.split(' ').length;
              if (!sentence.endsWith('.')) {
                sentence += '.';
              };
              const wordCount = sentence.split(' ').filter(word => words.has(word)).length;
              if (wordTotal <= 30 && wordCount >= 2 || wordCount / wordTotal >= 0.2) {
                return <><input
                  key={ sIdx }
                  ref={ (ele) => userInputs.current[inputIdx += 1] = ele! }
                  type='text'
                  onKeyDown={ (e) => {
                    if (e.key === ' ') {
                      e.stopPropagation();
                    }
                  } }
                />
                  <label data-answer={ sentence } />
                </>
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
    </div>
  </div>
}

export default Dictation;
