import React, { useEffect, FC, useRef, useState, useCallback } from 'react';
import WaveForm, { WaveFormHandle } from './WaveForm';

export type playerProps = {
  audio_url: string;
  last?: string;
  next?: string;
  toNext?: () => void;
  toLast?: () => void;
}


const Player: FC<playerProps> = (props) => {

  const { last, next, toNext, toLast, audio_url } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const waveFormRef = useRef<WaveFormHandle>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      waveFormRef.current?.seek(3);
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      waveFormRef.current?.seek(-2);
    }
  }, [isPlaying]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='player'>
      <WaveForm
        ref={ waveFormRef }
        url={ audio_url }
        playing={ isPlaying }
        onInteract={ () => {
          setIsPlaying(true);
        } } />
      <div className='control'>
        <div className='last' data-title={ last } onClick={ toLast }>Last</div>
        <div onClick={ () => {
          setIsPlaying(!isPlaying)
        } }>{
            isPlaying ? 'Pause' : 'Play' }
        </div>
        <div className='next' data-title={ next } onClick={ toNext } >Next</div>
      </div>
    </div>
  );
}


export default Player;

