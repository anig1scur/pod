import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Episode from '@/pages/Episode';
import EpisodeList from '@/pages/Episode/list';

export default [
  {
    path: '/:id',
    element: <EpisodeList />,
  },
  {
    path: '/6mins/:id',
    element: <Episode />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
] as RouteObject[];
