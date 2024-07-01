import Logo from '@/components/Logo';
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  difficulty: number;
  logoUrl: string;
  href: string;
}

const Card: React.FC<CardProps> = ({ href, title, description, difficulty, logoUrl }) => {
  const stars = '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

  return (
    <a href={ href } className="max-w-sm border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
      <img className="w-full h-48 object-cover border-b-[3px] border-black" src={ logoUrl } alt={ title } />
      <div className="px-6 py-4">
        <div className="font-bold text-3xl mb-2">{ title }</div>
        <p className="text-zinc-600 text-base">{ description }</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block border-[3px] rounded-lg border-black px-3 py-1 text-lg font-bold text-[#D93D86] mb-3">
          { stars }
        </span>
      </div>
    </a>
  );
};


const Index = () => {
  return (
    <div className='flex flex-col'>
      <Logo text="POD!" />
      <div className="max-w-4xl mt-28">
        <div className="flex flex-wrap gap-12">
          <Card
            href='/#/6mins'
            title="6 Minutes English"
            description="Improve your English skills with short, engaging lessons."
            difficulty={ 2 }
            logoUrl="/assets/6mins/logo.gif"
          />
          <Card
            href='/#/sciam'
            title="Scientific American"
            description="Explore fascinating scientific topics and discoveries."
            difficulty={ 4 }
            logoUrl="/assets/sciam/logo.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;