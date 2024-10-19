import React, { useState, useEffect, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';

type Episode = {
  id: string;
  title: string;
  img: string;
  url: string;
  audio: string;
};

export enum podType {
  sixmins = '6mins',
  sciam = 'sciam',
  epod = 'epod',
  tfts = 'tfts',
  lifekit = 'lifekit',
}

export const FullNameMap = {
  [podType.sixmins]: '6 Minutes English',
  [podType.sciam]: 'Scientific American',
  [podType.epod]: 'English Pod',
  [podType.tfts]: 'Think Fast Talk Smart',
  [podType.lifekit]: 'NPR Life Kit',
};

export const SourceMap = {
  [podType.sixmins]: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
  [podType.sciam]: 'https://www.scientificamerican.com/podcast/60-second-science/',
  [podType.epod]: 'https://www.englishpod.com/',
  [podType.tfts]: 'https://www.gsb.stanford.edu/insights/think-fast-talk-smart-podcast',
  [podType.lifekit]: 'https://www.npr.org/lifekit',
};



const EpisodeList = () => {
  const { id } = useParams<{ id: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);

  const perPage = 12;

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const module = await import(`../../utils/${ id }.ts`);
        const episodesData = module.default;
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Error loading episodes:", error);
      }
    };

    if (id) {
      fetchEpisodes();
    }
  }, [id]);

  useEffect(() => {
    const filtered = episodes.filter(episode =>
      episode.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEpisodes(filtered);
  }, [searchTerm, episodes]);

  const indexOfLastEpisode = currentPage * perPage;
  const indexOfFirstEpisode = indexOfLastEpisode - perPage;
  const currentEpisodes = filteredEpisodes.slice(indexOfFirstEpisode, indexOfLastEpisode);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredEpisodes.length / perPage);

    const pageWindow = 3; // Number of pages to show around the current page
    let startPage = Math.max(1, currentPage - pageWindow);
    let endPage = Math.min(totalPages, currentPage + pageWindow);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage;i <= endPage;i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        { pageNumbers.map((number, index) => (
          <button
            key={ index }
            onClick={ () => typeof number === 'number' && handleClick(number) }
            disabled={ number === '...' }
            className={ number === currentPage ? 'active' : '' }
          >
            { number }
          </button>
        )) }
      </div>
    );
  };


  return (
    <div className="flex flex-col m-auto pb-10">
      <Header />
      <main className='flex flex-nowrap gap-8 flex-col mt-10'>
        <div className='flex flex-row gap-8 justify-between'>
          <a href={ SourceMap[id as podType] } target='_blank' rel='noreferrer' className='hover:outline-dashed hover:outline-[#D93D86] hover:outline-4 pb-2 inline-block '>
            <h1>{ FullNameMap[id as podType] }</h1>
          </a>
          <div className='search-bar'>
            <input
              className='border-b-[3px] border-black'
              type="text"
              value={ searchTerm }
              onChange={ e => {
                setCurrentPage(1);
                setSearchTerm(e.target.value)
              } }
            />
          </div></div>
        <div className="episodes-grid">
          { currentEpisodes.map(episode => (
            <Link key={ episode.id } to={ `${ episode.id }` } className='episode_card'>
              <img src={ episode.img } alt={ episode.title } />
              <div className="episode-title">{ episode.title }</div>
            </Link>
          )) }
        </div>
        { renderPagination() }
      </main>
    </div>
  );
};

export default EpisodeList;
