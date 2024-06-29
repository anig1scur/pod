import React, { FC } from 'react';


export type infoProps = {
  intro: string[];
  vocab?
  : {
    text: string;
    desc: string;
  }[];
}


const Info: FC<infoProps> = (props) => {
  const {
    intro,
    vocab
  } = props;

  return (
    <div className='info'>
      <div className='introduction'>
        <h3>Introduction</h3>
        { intro.map((para, index) => (
          <p key={ index }>{ para }</p>
        )) }
      </div>
      { vocab &&
        <div className='vocabulary'>
          <h3>Vocabulary</h3>
          <ul>
            { vocab.map((word, index) => (
              <li key={ index }>
                <div className='text'>{ word.text }</div>
                <div className='desc'>{ word.desc }</div>
              </li>
            )) }
          </ul>
        </div> }
    </div>
  )
}


export default Info;

