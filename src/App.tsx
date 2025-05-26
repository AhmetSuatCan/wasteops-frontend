import AuthForm from './layouts/auth/Index'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/userStore';
import { useEffect } from 'react';

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  return (
    <>
      <Toaster position="top-right" />
      {!isAuthenticated && <AuthForm />}
    </>
  )
}

export default App
