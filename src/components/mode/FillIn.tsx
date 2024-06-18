import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { Scripts } from '@/types';
import { loadVocab, VocabType } from '@/utils/words';

export type fillInProps = {
  scripts: Scripts;
  vocab: VocabType;
}


const FillIn: FC<fillInProps> = (props) => {
  const { scripts, vocab } = props;
  const [words, setWords] = useState<string[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const blanks = useRef<HTMLSpanElement[]>([]);

  const checkAnswer = useCallback(() => {
    blanks.current.forEach(element => {
      const answer = element.dataset.answer;
      const inputs = element.querySelectorAll('input');
      const userAnswer = Array.from(inputs).map(input => input.value).join('');
      if (answer === userAnswer) {
        element.classList.remove("wrong");
        element.classList.add("corrpect");
      } else {
        element.classList.add('wrong');
        element.classList.remove('correct');
      }
    });
  }, [blanks.current]);

  useEffect(() => {
    const fetchWords = async () => {
      const fetchedWords = await loadVocab(vocab || 'C1');
      setWords(fetchedWords);
    };

    fetchWords();
  }, [vocab]);

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

  if (!words || words.length === 0) {
    return <div>Loading...</div>
  }
  let qNum = 0;

  return <div className='fill_in'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          return <div key={ script_index } className='script'>
            <h3 title={ script.author }>{ script.author }</h3>
            <div>{ script.text.split(' ').map((word, word_index) => {

              if (words.includes(word)) {
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
    </div>
  </div>
}


export default FillIn;
