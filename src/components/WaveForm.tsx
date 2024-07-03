import { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';

export type WaveFormProps = {
  url: string;
  peaks?: number[];
  playing?: boolean;
  waveColor?: string;
  progressColor?: string;
  onInteract?: () => void;
};

export type WaveFormHandle = {
  seek: (time: number) => void;
  onready: (callback: () => void) => void;
};

const WaveForm = forwardRef<WaveFormHandle, WaveFormProps>((props, ref) => {
  const waveform = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer>();

  useEffect(() => {
    if (waveform.current) {
      const _wavesurfer = WaveSurfer.create({
        container: waveform.current,
        waveColor: props.waveColor || 'pink',
        progressColor: props.progressColor || '#D93D86',
      });

      _wavesurfer.on('interaction', () => {
        if (props.onInteract) {
          props.onInteract();
        }
      });

      if (props.peaks) {
        _wavesurfer.load(props.url, [props.peaks])
      }
      else {
        _wavesurfer.load(props.url);
      }
      wavesurfer.current = _wavesurfer;
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [props.url]);

  useEffect(() => {
    if (props.playing) {
      wavesurfer.current?.play();
    } else {
      wavesurfer.current?.pause();
    }
  }, [props.playing]);

  useImperativeHandle(ref, () => ({
    seek(time: number) {
      const curTime = wavesurfer.current?.getCurrentTime() || 0;
      const duration = wavesurfer.current?.getDuration() || 1;
      wavesurfer.current?.seekTo((curTime + time) / duration);
    },
    onready(callback: () => void) {
      wavesurfer.current?.on('ready', callback);
    }
  }));

  return <div id="waveform" ref={ waveform } />;
});

export default WaveForm;
