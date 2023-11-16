import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoginPage } from '../../pages/Login';

const NonAuthenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const router = createBrowserRouter([
    {
      path: '/',
      element: !isAuthenticated ? <LoginPage /> : null,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default NonAuthenticated;