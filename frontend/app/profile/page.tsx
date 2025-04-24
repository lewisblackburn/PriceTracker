'use client';

import { withAuth } from '../hoc/withAuth';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import PriceChart from '@/components/shared/price-history-graph';
import { Product } from '@/features/products/schemas/product.schema';
import Link from 'next/link';

function UserProfilePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/getAll`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  if (!token)
    return (
      <div className="flex items-center justify-center h-64">
        Loading token...
      </div>
    );
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        Loading products...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!products)
    return (
      <div className="flex items-center justify-center h-64">
        No products found
      </div>
    );

  return (
    <div className="block md:container mx-auto px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-lg text-muted-foreground">{user?.email}</p>
      </div>

      <h2 className="text-xl font-bold">Product History Graphs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => {
          const prices =
            typeof product.price_history === 'string'
              ? JSON.parse(product.price_history)
              : product.price_history;
          return (
            <div key={product.id}>
              <Link href={`/products/${product.id}`}>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h2 className="text-lg text-gray-600 mb-1">{product.name}</h2>
                  <PriceChart prices={prices} />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withAuth(UserProfilePage);
