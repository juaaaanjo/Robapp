import React from 'react';
import { useSelector } from 'react-redux';
import Authenticated from '../authenticated/authenticated';
import NonAuthenticated from '../non-authenticated/non-authenticated';

const AppRouter = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Authenticated /> : <NonAuthenticated />;
};

export default AppRouter;