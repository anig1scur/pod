import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Episode from '@/pages/Episode';
import Index from '@/pages/Index';
import EpisodeList from '@/pages/Episode/list';

export default [
  {
    path: '/',
    element: <Index />,
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
