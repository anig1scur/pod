import React, { useState, useEffect, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '@/components/Logo';

type Episode = {
  id: string;
  title: string;
  img: string;
  url: string;
  audio: string;
};

type EpisodeListProps = {
  episodes?: Episode[];
};

const EpisodeList = () => {
  const { id } = useParams<{ id: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);

  const episodesPerPage = 12;

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

  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(indexOfFirstEpisode, indexOfLastEpisode);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);

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
    <div className="episode-list">
      <header>
        <Logo text="POD!" />
      </header>
      <main className='flex flex-nowrap gap-16 flex-col'>
        <input
          type="text"
          placeholder="Search episodes..."
          value={ searchTerm }
          onChange={ e => setSearchTerm(e.target.value) }
        />
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
