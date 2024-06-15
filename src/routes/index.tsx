import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import CourseList from '@/pages/CourseList';

export default [
  {
    path: '/',
    element: <CourseList />,
    children: [{ index: true, element: <CourseList /> }],
  },
  {
    path: '/*',
    element: <NotFound />,
  },
] as RouteObject[];
