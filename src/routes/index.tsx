import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Episode from '@/pages/Episode';
import Index from '@/pages/index';
import EpisodeList from '@/pages/Episode/list';
import VideoDemo from '@/pages/VideoDemo';
import VideoEpisode from '@/pages/VideoEpisode';

export default [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/video-demo',
    element: <VideoDemo />,
  },
  {
    path: '/video/:pid/:eid',
    element: <VideoEpisode />,
  },
  {
    path: '/:id',
    element: <EpisodeList />,
  },
  {
    path: '/:pid/:eid',
    element: <Episode />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
] as RouteObject[];
