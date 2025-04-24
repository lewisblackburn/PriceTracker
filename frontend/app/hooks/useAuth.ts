'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';

interface User {
  id: number;
  email: string;
}

interface AuthResult {
  user: User | null;
  loading: boolean;
}

export default function useAuth(): AuthResult {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
    } catch (e) {
      console.error('Invalid token', e);
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname]);

  return { user, loading };
}
