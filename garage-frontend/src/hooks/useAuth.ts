import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuth = () => {
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);

  return {
    user,
    token,
    loading: isLoading,
    isAuthenticated: !!user && !!token,
  };
};
