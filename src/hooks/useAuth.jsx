import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const useAuth = (shouldRedirectIfAuthenticated = false) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = Cookies.get('Token');
    
    if (shouldRedirectIfAuthenticated && token) {
      router.replace('/'); 
    } else if (!shouldRedirectIfAuthenticated && !token) {
      router.replace('/login');
    }
  }, [router, shouldRedirectIfAuthenticated]);

  return {
    isAuthenticated: !!Cookies.get('Token'),
    logout: () => {
      Cookies.remove('Token');
      queryClient.clear();
      router.replace('/login');
    }
  };
};

export default useAuth;