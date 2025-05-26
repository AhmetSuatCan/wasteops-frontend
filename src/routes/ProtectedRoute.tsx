import { useState, useEffect, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../services/api/auth'; // make sure this matches your import
import Loader from '../components/Loader';
import OrganizationCheck from '../components/OrganizationCheck';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null: still checking

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await authApi.getUser(); // 🍪 Uses cookie
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return <Loader />; // Still verifying
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <OrganizationCheck />
      {element}
    </>
  );
};

export default ProtectedRoute;

