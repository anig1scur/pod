import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import SixMins from '@assets/6mins/logo.gif';
import Tfts from '@assets/tfts/logo.webp';
import Sciam from '@assets/sciam/logo.png';
import Lifekit from '@assets/lifekit/lifekit.png';

interface PodcastCardProps {
  title: string;
  description: string;
  difficulty: number;
  logoUrl: string;
  href: string;
  featured?: boolean;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ href, title, description, difficulty, logoUrl, featured }) => {
  const stars = '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

  return (
    <Link
      to={ href }
      className={
        `w-full md:w-[48%] lg:w-[31%] border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
          featured ? 'ring-4 ring-[#D93D86] ring-offset-2' : ''
        }`
      }
    >
      {/* Hide cover image on mobile for compact layout */}
      <img
        className="hidden sm:block w-full h-40 object-cover border-b-[3px] border-black"
        src={ logoUrl }
        alt={ title }
      />
      {/* Mobile: small thumbnail + title inline */}
      <div className="flex sm:hidden items-center gap-3 p-3 border-b border-zinc-200">
        <img
          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          src={ logoUrl }
          alt={ title }
        />
        <div className="font-bold text-xl leading-tight">{ title }</div>
      </div>
      <div className="px-4 py-3">
        <div className="hidden sm:block font-bold text-2xl mb-1">{ title }</div>
        { featured && (
          <span className="inline-block text-xs font-bold bg-[#D93D86] text-white rounded px-2 py-0.5 mb-1">📌 Featured</span>
        ) }
        <p className="text-zinc-600 text-sm">{ description }</p>
      </div>
      <div className="px-4 pb-3">
        <span className="inline-block border-[2px] rounded-lg border-black px-2 py-0.5 text-base font-bold text-[#D93D86]">
          { stars }
        </span>
      </div>
    </Link>
  );
};

const Index = () => {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className="mt-6">
        <div className="mb-10 flex flex-wrap gap-4 sm:gap-6 justify-between">
          {/* 6 Minutes English pinned first */}
          <PodcastCard
            href='/6mins'
            title="6 Minutes English"
            description="Improve your English skills with short, engaging BBC lessons. Great for beginners."
            difficulty={ 2 }
            logoUrl={ SixMins }
            featured
          />
          <PodcastCard
            href='/lifekit'
            title="NPR Life Kit"
            description="Everyone needs a little help being a human. From sleep to saving money to parenting and more."
            difficulty={ 3 }
            logoUrl={ Lifekit }
          />
          <PodcastCard
            href='/tfts'
            title="Think Fast Talk Smart"
            description="Learn how to communicate more effectively in professional settings."
            difficulty={ 4 }
            logoUrl={ Tfts }
          />
          <PodcastCard
            href='/sciam'
            title="Scientific American"
            description="Explore fascinating scientific topics and discoveries."
            difficulty={ 4 }
            logoUrl={ Sciam }
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
