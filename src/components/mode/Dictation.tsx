import React, { FC, useRef, useCallback, useEffect, Fragment } from 'react';
import { Scripts } from '@/types';
import stringSimilarity from 'string-similarity';

export type dictationProps = {
  scripts: Scripts;
  displayAuthor: boolean;
  words: Set<string>;
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
  const { scripts, words, displayAuthor = true } = props;
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
      console.log(input, answer, userAnswer);

      const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);
      if (similarity >= 0.9) {
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
          const sentenceWithDelimiters = pairWordsWithDelimiters(script.text.split(/([,;.])/));
          return <div key={ script_index } className='script' >
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
    </div>
  </div>
}

export default Dictation;
