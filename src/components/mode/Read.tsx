import React, { FC, useState, useEffect } from 'react';
import { Scripts } from '@/types';

export type readProps = {
  scripts: Scripts;
  words: Set<string>;
  displayAuthor: boolean;
}

const Read: FC<readProps> = (props) => {
  const { scripts, words, displayAuthor = true } = props;

  if (!words || words.size === 0) {
    return <div>Loading...</div>
  }

  return <div className='mode read'>
    <div className='scripts'>
      {
        scripts.map((script, script_index) => {
          return <div key={ script_index } className='script'>
            { displayAuthor && <h3 title={ script.author }>{ script.author }</h3> }
            <div>{ script.text.split(' ').map((word, word_index) => {
              if (words.has(word)) {
                return <span key={ word_index } className='highlight'> { word } </span>
              } else {
                return <span key={ word_index }> { word } </span>
              }
            }) }</div>
          </div>
        })
      }
    </div>
  </div>
}

export default Read;
