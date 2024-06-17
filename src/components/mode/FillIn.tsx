import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Scripts } from '@/types';
import { loadCEFR } from '@/utils/words';

export type fillInProps = {
  scripts: Scripts;
}


const FillIn: FC<fillInProps> = (props) => {
  const { scripts } = props;
  const [words, setWords] = React.useState<string[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const fetchedWords = await loadCEFR('B1');
      setWords(fetchedWords);
    };

    fetchWords();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const index = parseInt(e.currentTarget.dataset.index || '0');
    const isLetter = /^[a-zA-Z\-]$/;
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

  return <div className='fill_in'>
    {
      scripts.map((script, script_index) => {
        return <div key={ script_index } className='script'>
          <h3>{ script.author }</h3>
          <p>{ script.text.split(' ').map((word, word_index) => {

            if (words.includes(word)) {
              const el = <span className="blank" key={ word_index }> {
                Array.from(
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

              } </span>;
              cur += word.length;
              return el;
            } else {
              return <span key={ word_index }> { word } </span>
            }
          }) }</p>
        </div>
      })
    }
  </div>
}


export default FillIn;
