import React, { useEffect, FC, useState, useCallback } from 'react';
import WaveForm, { WaveFormHandle } from './WaveForm';

export type PlayerProps = {
  audio_url: string;
  peaks: number[];
  start_time?: number;
  last?: string;
  next?: string;
  toNext?: () => void;
  toLast?: () => void;
  waveFormRef: React.RefObject<WaveFormHandle>;
}

const Player: FC<PlayerProps> = (props) => {
  const { last, next, toNext, toLast, audio_url, waveFormRef } = props;
  const [playState, setPlayState] = useState<'loading' | 'playing' | 'paused'>('paused');

  useEffect(() => {
    if (!waveFormRef?.current) return;

    if (props.start_time) {
      waveFormRef.current.onready(() => {
        waveFormRef.current?.seek(props.start_time || 0);
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
        onSeek={ () => {
          setPlayState('loading');
        }}
        onError={ () => {
          setPlayState('loading');
        } }
        onSeeked={ () => {
          setPlayState('playing');
        }}
      />
      <div className='control'>
        <div className='title' title={ last || "NO LAST EPISODE" }>{ last || "NO LAST EPISODE" }</div>
        <div className='backfoward' onClick={ backfoward } />
        <div className='last' onClick={ _toLast } />
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
        <div className='next' onClick={ _toNext } />
        <div className='forward' onClick={ forward } />
        <div className='title' title={ next || "NO NEXT EPISODE" }>{ next || "NO NEXT EPISODE" }</div>
      </div>
    </div>
  );
}

export default Player;