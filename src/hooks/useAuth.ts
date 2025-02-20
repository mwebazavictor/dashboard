// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface User {
  accessToken: string;
  company_id: string;
  // Add other user properties as needed
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const userInfo = Cookies.get('loggedUserInfo');

    if (accessToken && userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser({
          accessToken,
          company_id: parsedUserInfo.Company_id,
          // Add other user properties as needed
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user info:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
  };
};