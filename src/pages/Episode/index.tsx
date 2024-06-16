import React from 'react';
import Logo from "@/components/Logo"
import WaveForm from '@/components/WaveForm';

import Music from "@/assets/0715.mp3"

const NotFound = () => {
  return <div>
    <header> <Logo text="POD!" distance={ {
      x: 8,
      y: 4
    } } />
    </header>
    <WaveForm url={ Music } />
  </div>;
};

export default NotFound;
