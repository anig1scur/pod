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
}

// const VocabularyList = [


const PodcastCard: React.FC<PodcastCardProps> = ({ href, title, description, difficulty, logoUrl }) => {
  const stars = '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);

  return (
    <Link to={ href } className="min-w-48 w-[31%] border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
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
    </Link>
  );
};


const Index = () => {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className="mt-10">
        <div className="mb-10 flex flex-wrap gap-6 justify-between">
          <PodcastCard
            href='/lifekit'
            title="NPR Life Kit"
            description="Everyone needs a little help being a human. From sleep to saving money to parenting and more, life Kit is here to help you get it together."
            difficulty={ 3 }
            logoUrl={ Lifekit }
          />
          <PodcastCard
            href='/tfts'
            title="Think fast talk smart"
            description="Learn how to communicate more effectively in professional settings."
            difficulty={ 4 }
            logoUrl={ Tfts }
          />
          <PodcastCard
            href='/6mins'
            title="6 Minutes English"
            description="Improve your English skills with short, engaging lessons."
            difficulty={ 2 }
            logoUrl={ SixMins }
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