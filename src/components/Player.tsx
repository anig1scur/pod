import React, { useEffect, FC, useRef, useState } from 'react';
import WaveForm, { WaveFormHandle } from './WaveForm';

export type playerProps = {
  audio_url: string;
}


const Player: FC<playerProps> = (props) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const waveFormRef = useRef<WaveFormHandle>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        waveFormRef.current?.seek(3);
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        waveFormRef.current?.seek(-2);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='player'>
      <WaveForm
        ref={ waveFormRef }
        url={ props.audio_url }
        playing={ isPlaying }
        onInteract={ () => {
          setIsPlaying(true);
        } } />
      <div className='control'>
        <button>Last</button>
        <button onClick={ () => {
          setIsPlaying(!isPlaying)
        } }>{
            isPlaying ? 'Pause' : 'Play' }
        </button>
        <button>Next</button>
      </div>
    </div>
  );
}


export default Player;

