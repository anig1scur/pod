import React, { CSSProperties, FC } from 'react';
import cx from 'classnames';

export enum Theme {
  colorful = "colorful",
}

export type distance = {
  x: number;
  y: number;
}

export type logoProps = {
  text: string;
  distance?: distance;
  theme?: Theme;
}

const Palette = {
  [Theme.colorful]: [
    "#D93D86",
    "#55B3D9",
    "#61A656",
    "#F2D852",
    "white"
  ]
}

const Logo: FC<logoProps> = (props) => {

  const {
    text,
    distance = { x: 7, y: 4 }
  } = props;

  const theme = props.theme || Theme.colorful;
  return (
    <div className={ "logo" }>
      {
        Array.from({ length: 5 }).map((_, index) => (
          <div key={ index }
            className={ cx(theme, "text") }
            style={ {
              '--y-distance': `${ distance.y }px`,
              '--x-distance': `${ distance.x }px`,
              color: Palette[theme][index]
            } as CSSProperties }
          >{ text }</div>
        ))
      }
    </div>
  );
}


export default Logo;