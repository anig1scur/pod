import React, { useEffect, FC, useRef, useState, useCallback } from 'react';
import WaveForm, { WaveFormHandle } from './WaveForm';

export type playerProps = {
  audio_url: string;
  peaks: number[];
  start_time?: number;
  last?: string;
  next?: string;
  toNext?: () => void;
  toLast?: () => void;
  waveFormRef: React.RefObject<WaveFormHandle>;
}


const Player: FC<playerProps> = (props) => {

  const { last, next, toNext, toLast, audio_url, waveFormRef } = props;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveFormRef) {
      return;
    }

    if (!waveFormRef.current) {
      return;
    }

    if (props.start_time && waveFormRef.current) {
      waveFormRef.current.onready(() => {
        waveFormRef.current?.seek(props.start_time || 0);
      })
    }
  }, [props.start_time, waveFormRef.current]);

  const backfoward = useCallback(() => {
    waveFormRef.current?.seek(-2);
  }, [isPlaying]);

  const forward = useCallback(() => {
    waveFormRef.current?.seek(3);
  }, [isPlaying]);

  const _toNext = () => {
    next && toNext && toNext();
    setIsPlaying(false);
  }

  const _toLast = () => {
    last && toLast && toLast();
    setIsPlaying(false);
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
      e.preventDefault();
      _toNext();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
      e.preventDefault();
      _toLast();
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      forward();
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      backfoward();
    }
  }, [isPlaying, next, last]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [next, last]);

  return (
    <div className='player'>
      <WaveForm
        peaks={ props.peaks || [0, 1, 2, 3, 4, 5, 4, 3, 2, 1] }
        ref={ waveFormRef }
        url={ audio_url }
        playing={ isPlaying }
        onInteract={ () => {
          setIsPlaying(true);
        } } />
      <div className='control'>
        <div className='title' title={ last || "NO LAST EPISODE" } >{ last || "NO LAST EPISODE" }</div>
        <div className='backfoward' onClick={ backfoward } />
        <div className='last' onClick={ _toLast } />
        <div className={
          isPlaying ? 'pause' : 'play'
        } onClick={ () => {
          setIsPlaying(!isPlaying)
        } } />
        <div className='next' onClick={ _toNext } />
        <div className='forward' onClick={ forward } />
        <div className='title' title={ next || "NO NEXT EPISODE" }>{ next || "NO NEXT EPISODE" }</div>
      </div>
    </div>
  );
}


export default Player;

