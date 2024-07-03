import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Dialog from '@/components/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className='about'>
      <h3>
        1. POD ! 是什么？
      </h3>
      <p>
        Pod 是一个用于英语学习的前端应用，包括音频 / 阅读 / 听写 / 词汇模块。
      </p>
      <h3>
        2. POD ! 的数据来源是什么？
      </h3>
      <p>
        现在 Pod 的数据来源于 <a href='https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' target='_blank'>BBC 6 minute English</a> 和 <a href='https://www.scientificamerican.com/podcasts/' target='_blank'>科学美国人</a>
        的部分播客，后续会看情况增加更多。
      </p>
      <h3>
        2. POD ! 的词汇表有哪些
      </h3>
      <p>
        Pod 的词汇表取自网络，包括

        <a href='https://github.com/anig1scur/CEFR-Vocabulary-List/' target='_blank'>CEFR</a>
        ,
        <a href='https://www.eapfoundation.com/vocab/academic/awllists/' target='_blank'>AWL</a>
        ,
        <a href='https://www.vocabulary.com/lists/128536' target='_blank'>GRE 5000</a>
        ,
        <a href='https://r.piggy.lol/pod/assets/pdf/manhattan_prep_1000_gre_words_.pdf' target='_blank'>GRE Manhattan Prep 1000</a>
        ,
        以及
        <a href='https://quizlet.com/tw/211687200/mason-gre-2000-flash-cards/' target='_blank'>
          GRE Mason 2000
        </a>
      </p>
      <h3>
        3. 我发现了错误或者有改进的建议，应该怎么做？
      </h3>
      <p>
        点击右上角的 <a href='https://github.com/anig1scur/pod/' className='github bg-black mx-1'></a> 进入此项目的 GitHub 仓库， 点击 issues Tab 提交你的问题或者建议。
      </p>
    </div>
  )
}

const Header = () => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <header>
      <Logo text="POD!" />
      <div className='flex justify-center items-center text-zinc-800'>
        <>
          <FontAwesomeIcon
            title='about'
            className='cursor-pointer w-6 h-6 mx-4'
            icon={ faQuestionCircle }
            onClick={ () => setShowDialog(true) }
          />
          {
            <Dialog
              isOpen={ showDialog }
              header={ <div className='text-3xl mb-5'>关于 <strong>POD !</strong> </div> }
              content={ <About /> }
              showBottom={ false }
              onOk={ () => setShowDialog(false) }
              onCancel={ () => setShowDialog(false) }
            />
          }
        </>
        <a title='source code' href="https://github.com/anig1scur/pod" target='_blank' className='github bg-zinc-800' />
      </div>
    </header>
  );
}

export default Header;
