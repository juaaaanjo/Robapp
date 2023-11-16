import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomePage } from '../../pages/Home';

const Authenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? <HomePage /> : null,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Authenticated;