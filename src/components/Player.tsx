import React, { useEffect, FC, useState, useCallback } from 'react';
import WaveForm, { WaveFormHandle } from './WaveForm';

export type PlayerProps = {
  audio_url: string;
  peaks: number[];
  duration: number;
  start_time?: number;
  last?: string;
  next?: string;
  toNext?: () => void;
  toLast?: () => void;
  waveFormRef: React.RefObject<WaveFormHandle>;
}

const Player: FC<PlayerProps> = (props) => {
  const { last, next, toNext, toLast, audio_url, waveFormRef, duration } = props;
  const [playState, setPlayState] = useState<'loading' | 'playing' | 'paused'>('paused');
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setCurrentTime(0);
  }, [audio_url]);

  useEffect(() => {
    if (!waveFormRef?.current) return;
    if (props.start_time) {
      waveFormRef.current.onready(() => {
        waveFormRef.current?.seek(props.start_time || 0);
        setCurrentTime(props.start_time || 0);
      });
    }
  }, [props.start_time, waveFormRef]);

  const backfoward = useCallback(() => {
    waveFormRef.current?.seek(-2);
  }, []);

  const forward = useCallback(() => {
    waveFormRef.current?.seek(3);
  }, []);

  const _toNext = () => {
    if (next && toNext) {
      toNext();
      setPlayState('paused');
    }
  }

  const _toLast = () => {
    if (last && toLast) {
      toLast();
      setPlayState('paused');
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setPlayState(prev => prev === 'paused' ? 'playing' : 'paused');
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
  }, [next, last]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }`;
  };

  return (
    <div className='player'>
      <WaveForm
        peaks={ props.peaks || [0, 1, 2, 3, 4, 5, 4, 3, 2, 1] }
        ref={ waveFormRef }
        url={ audio_url }
        playing={ playState !== 'paused' }
        onInteract={ () => {
          setPlayState('loading');
        } }
        onSeek={ (time) => {
          setPlayState('loading');
          setCurrentTime(time);
        } }
        onError={ () => {
          setPlayState('loading');
        } }
        onAudioProcess={ (time) => {
          setCurrentTime(time);
        } }
        onSeeked={ () => {
          setPlayState('playing');
        } }
      />
      <div className='progress'>
        <span>{ formatTime(currentTime) }</span> / <span>{ formatTime(duration) }</span>
      </div>
      <div className='control'>
        <div className='title' title={ last || "NO LAST EPISODE" }>{ last || "NO LAST EPISODE" }</div>
        <div className='backfoward' title="回退" onClick={ backfoward } />
        <div className='last' title="上一集" onClick={ _toLast } />
        <div
          className={
            `play ${ playState }`
          }
          onClick={ () => {
            if (playState !== 'loading') {
              setPlayState(prev => prev === 'playing' ? 'paused' : 'playing');
            }
          } }
        />
        <div className='next' title="下一集" onClick={ _toNext } />
        <div className='forward' title='快进' onClick={ forward } />
        <div className='title' title={ next || "NO NEXT EPISODE" }>{ next || "NO NEXT EPISODE" }</div>
      </div>
    </div>
  );
}

export default Player;
