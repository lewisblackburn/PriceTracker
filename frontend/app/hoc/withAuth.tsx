'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else {
          setChecked(true);
        }
      }
    }, [user, loading, router]);

    if (!checked) return null;

    // @ts-expect-error this is a type error that does not affect the build
    return <WrappedComponent {...props} />;
  };
}
