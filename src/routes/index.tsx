import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Episode from '@/pages/Episode';

export default [
  {
    path: '/',
    element: <Episode />,
    children: [{ index: true, element: <Episode /> }],
  },
  {
    path: '/6mins/:id',
    element: <Episode />,
    children: [{ index: true, element: <Episode /> }],
  },
  {
    path: '/*',
    element: <NotFound />,
  },
] as RouteObject[];
