import { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';

export type WaveFormProps = {
  url: string;
  peaks?: number[];
  playing?: boolean;
  waveColor?: string;
  progressColor?: string;
  onInteract?: () => void;
  onError?: () => void;
  onSeek?: (time: number) => void;
  onSeeked?: () => void;
  onReady?: () => void;
  onAudioProcess?: (time: number) => void;
  onAutoplayFailed?: () => void;
};

export type WaveFormHandle = {
  seek: (time: number) => void;
  onready: (callback: () => void) => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
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

      _wavesurfer.on('ready', () => {
        if (props.onReady) {
          props.onReady();
        }
      });

      _wavesurfer.on('interaction', () => {
        if (props.onInteract) {
          props.onInteract();
        }
      });

      _wavesurfer.on('seeking', () => {
        if (props.onSeek) {
          props.onSeek(_wavesurfer.getCurrentTime());
        }
      });

      _wavesurfer.getMediaElement().onseeked = () => {
        if (props.onSeeked) {
          props.onSeeked();
        }
      }

      _wavesurfer.on('audioprocess', (time) => {
        if (props.onAudioProcess) {
          props.onAudioProcess(time);
        }
      });

      _wavesurfer.on('error', (err) => {
        console.error(err);
        if (props.onError) {
          props.onError();
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
      wavesurfer.current?.play().catch((err) => {
        if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
          props.onAutoplayFailed?.();
        }
      });
    } else {
      wavesurfer.current?.pause();
    }
  }, [props.playing, props.onAutoplayFailed, props.url]);

  useImperativeHandle(ref, () => ({
    seek(time: number) {
      const curTime = wavesurfer.current?.getCurrentTime() || 0;
      const duration = wavesurfer.current?.getDuration() || 1;
      wavesurfer.current?.seekTo((curTime + time) / duration);
    },
    seekTo(time: number) {
      time = time <= 0 ? 0.01 : time;
      wavesurfer.current?.seekTo(time / wavesurfer.current?.getDuration() || 1);
    },
    onready(callback: () => void) {
      wavesurfer.current?.on('ready', callback);
    },
    getCurrentTime() {
      return wavesurfer.current?.getCurrentTime() || 0;
    },
    getDuration() {
      return wavesurfer.current?.getDuration() || 0;
    }
  }));

  return <div id="waveform" ref={ waveform } />;
});

export default WaveForm;
