import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

const V2Index = () => {
  return (
    <div className='flex flex-col'>
      <Header />
      <div className="mt-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">V2 Features</h1>
          <p className="text-xl text-zinc-700 mb-8">
            Explore the new video features in version 2.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              to="/v2/video-demo"
              className="w-full md:w-[48%] lg:w-[31%] border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 block"
            >
              <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🎬</span>
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-3xl mb-2">Video Demo</div>
                <p className="text-zinc-600 text-base">Remotion demo for podcast video generation</p>
              </div>
            </Link>
            <Link
              to="/v2/video/lifekit/1136051123"
              className="w-full md:w-[48%] lg:w-[31%] border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 block"
            >
              <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🎧</span>
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-3xl mb-2">Sample Video</div>
                <p className="text-zinc-600 text-base">Try a sample podcast video with bilingual subtitles</p>
              </div>
            </Link>
            <Link
              to="/"
              className="w-full md:w-[48%] lg:w-[31%] border-black border-[3px] cursor-pointer rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105 block"
            >
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🏠</span>
              </div>
              <div className="px-6 py-4">
                <div className="font-bold text-3xl mb-2">Back to V1</div>
                <p className="text-zinc-600 text-base">Return to the original podcast experience</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2Index;