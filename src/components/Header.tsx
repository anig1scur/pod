import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Dialog from '@/components/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faStar, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { getHistory, getFavorites } from '@/utils/storage';
import { Link } from 'react-router-dom';

const About = () => {
  return <ul className='about'>
      <li>
        <h3>POD ! 是什么？</h3>
        <p>Pod 是一个用于英语学习的前端应用，包括音频 / 阅读 / 听写 / 词汇模块。</p>
      </li>
      <li>
        <h3>POD ! 的数据来源是什么？</h3>
        <p>
          现在 Pod 的数据来源于{' '}
          <a href='https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' target='_blank'>BBC 6 minute English</a>{' '}
          和 Scientific American 的部分播客，后续会看情况增加更多。
        </p>
      </li>
      <li>
        <h3>POD ! 的词汇表有哪些？</h3>
        <p>
          Pod 的词汇表取自网络，包括
          <a href='https://github.com/anig1scur/CEFR-Vocabulary-List/' target='_blank'>CEFR</a>,{' '}
          <a href='https://www.eapfoundation.com/vocab/academic/awllists/' target='_blank'>AWL</a>,{' '}
          <a href='https://www.vocabulary.com/lists/128536' target='_blank'>GRE 5000</a>,
          以及 GRE Manhattan / Mason 系列词汇表。
        </p>
      </li>
      <li>
        <h3>我发现了错误或者有改进建议？</h3>
        <p>
          点击右上角的 <a href='https://github.com/anig1scur/pod/' className='github bg-black mx-1'></a> 进入 GitHub 仓库，点击 Issues 提交。
        </p>
      </li>
    </ul>;
};

const HistoryPanel = () => {
  const history = getHistory();
  if (history.length === 0) {
    return <p className='text-zinc-500 text-base py-4'>No play history yet. Start listening to an episode!</p>;
  }
  return (
    <ul className='flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1'>
      { history.map((h, i) => (
        <li key={ i } className='flex items-center justify-between gap-2 border-b border-zinc-200 pb-2'>
          <Link
            to={ `/${ h.pid }/${ h.eid }` }
            className='text-base font-medium hover:text-[#D93D86] truncate flex-1'
          >
            { h.title }
          </Link>
          <span className='text-xs text-zinc-400 flex-shrink-0'>
            { new Date(h.playedAt).toLocaleDateString() }
          </span>
        </li>
      )) }
    </ul>
  );
};

const FavoritesPanel = () => {
  const favorites = getFavorites();
  if (favorites.length === 0) {
    return <p className='text-zinc-500 text-base py-4'>No favorites yet. Tap ⭐ on any episode to save it here.</p>;
  }
  return (
    <ul className='flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1'>
      { favorites.map((f, i) => {
        const [pid, eid] = f.key.split(':');
        return (
          <li key={ i } className='flex items-center justify-between gap-2 border-b border-zinc-200 pb-2'>
            <Link
              to={ `/${ pid }/${ eid }` }
              className='text-base font-medium hover:text-[#D93D86] truncate flex-1'
            >
              ⭐ { f.title || f.key }
            </Link>
            <span className='text-xs text-zinc-400 flex-shrink-0'>
              { new Date(f.addedAt).toLocaleDateString() }
            </span>
          </li>
        );
      }) }
    </ul>
  );
};

const Header = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <header>
      <Logo text="POD!" />
      <div className='flex justify-center items-center text-zinc-800 gap-1'>

        {/* Favorites */}
        <FontAwesomeIcon
          title='favorites'
          className='cursor-pointer w-5 h-5 mx-2 text-[#D93D86]'
          icon={ faStar }
          onClick={ () => setShowFavorites(true) }
        />
        <Dialog
          isOpen={ showFavorites }
          header={ <div className='text-2xl mb-4 font-bold'>⭐ Favorites</div> }
          content={ <FavoritesPanel /> }
          showBottom={ false }
          onOk={ () => setShowFavorites(false) }
          onCancel={ () => setShowFavorites(false) }
        />

        {/* History — faClockRotateLeft is the FA v6 name for the old faHistory */}
        <FontAwesomeIcon
          title='play history'
          className='cursor-pointer w-5 h-5 mx-2'
          icon={ faClockRotateLeft }
          onClick={ () => setShowHistory(true) }
        />
        <Dialog
          isOpen={ showHistory }
          header={ <div className='text-2xl mb-4 font-bold'>🕘 Play History</div> }
          content={ <HistoryPanel /> }
          showBottom={ false }
          onOk={ () => setShowHistory(false) }
          onCancel={ () => setShowHistory(false) }
        />

        {/* About */}
        <FontAwesomeIcon
          title='about'
          className='cursor-pointer w-5 h-5 mx-2'
          icon={ faQuestionCircle }
          onClick={ () => setShowAbout(true) }
        />
        <Dialog
          isOpen={ showAbout }
          header={ <div className='text-3xl mb-5'>关于 <strong>POD !</strong></div> }
          content={ <About /> }
          showBottom={ false }
          onOk={ () => setShowAbout(false) }
          onCancel={ () => setShowAbout(false) }
        />

        <a title='source code' href="https://github.com/anig1scur/pod" target='_blank' className='github bg-zinc-800 ml-2' />
      </div>
    </header>
  );
};

export default Header;
