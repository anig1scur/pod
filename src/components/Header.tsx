import Logo from '@/components/Logo';
import React from 'react';

const Header = () => {
  return (
    <header>
        <Logo text="POD!" />
        <a href="https://github.com/anig1scur/pod" target='_blank' className='github' />
    </header>
  );
}

export default Header;
