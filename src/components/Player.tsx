import React, { useEffect, FC, useRef, useState } from 'react';
import WaveForm from './WaveForm';

export type playerProps = {
  audio_url: string;
}


const Player: FC<playerProps> = (props) => {

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className='player'>
      <WaveForm url={ props.audio_url } />
      <div className='control'>
        <button>Last</button>
        <button>{
          isPlaying ? 'Pause' : 'Play' }
        </button>
        <button>Next</button>
      </div>
    </div>
  );
}


export default Player;

