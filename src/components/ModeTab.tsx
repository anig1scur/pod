import React, { useState, FC } from 'react';
import { Mode } from '@/types';
import cx from 'classnames';

export type modeTabProps = {
  type: Mode;
  onChange: (mode: Mode) => void;
};

const ModeTab: FC<modeTabProps> = (props) => {
  const { type, onChange } = props;
  return (
    <div className="mode_tab">
      { Object.entries(Mode).map(([key, value]) => {
        return <div
          key={ key }
          className={ cx('tab', { active: type === value }) }
          onClick={ () => onChange(value) }
        >
          { value }
        </div>
      })
      }
    </div>
  );
};

export default ModeTab;
