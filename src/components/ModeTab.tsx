import React, { useState, FC, useRef } from 'react';
import { Mode } from '@/types';
import cx from 'classnames';

export type modeTabProps = {
  type: Mode;
};

const ModeTab: FC<modeTabProps> = (props) => {
  const [mode, setMode] = useState<Mode>(props.type);
  return (
    <div className="mode_tab">
      { Object.entries(Mode).map(([key, value]) => {
        return <div
          key={ key }
          className={ cx('tab', { active: mode === value }) }
          onClick={ () => setMode(value) }
        >
          { value }
        </div>
      })
      }
    </div>
  );
};

export default ModeTab;
