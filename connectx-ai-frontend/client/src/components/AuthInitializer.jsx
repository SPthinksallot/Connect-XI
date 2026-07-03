import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export default function AuthInitializer({ children }) {
  const { isAuthenticated, accessToken, fetchMe } = useAuthStore();

  useEffect(() => {
    // If we have a token but not authenticated, fetch user data
    if (accessToken && !isAuthenticated) {
      console.log('🔄 Restoring session from token...');
      fetchMe();
    }
  }, []);

  return children;
}
