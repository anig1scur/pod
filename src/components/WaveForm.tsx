import React, { useEffect, FC, useRef } from 'react';
import cx from 'classnames';
import WaveSurfer from 'wavesurfer.js'


export type waveFormProps = {
  url: string;
  waveColor?: string;
  progressColor?: string;
}


const WaveForm: FC<waveFormProps> = (props) => {


  const waveform = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveform.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveform.current,
        url: props.url,
        waveColor: props.waveColor || 'pink',
        progressColor: props.progressColor || 'dark',
      });
      wavesurfer.load(props.url);
    }
  }
    , [props.url, props.waveColor, props.progressColor]);


  return (
    <div id="waveform" ref={ waveform } style={ { height: "100px" } }></div>
  );

}


export default WaveForm;

