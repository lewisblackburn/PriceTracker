'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import PriceChart from '@/components/shared/price-history-graph';
import { withAuth } from '@/app/hoc/withAuth';

function ProductPage() {
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', params?.id],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/get`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params?.id }),
      }).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'An error occurred');
          });
        }
        return res.json();
      }),
    enabled: !!token && !!params?.id,
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
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center h-64">
        No product found
      </div>
    );

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
          <a
            href={data.url}
            className="text-blue-600 hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Product Page
          </a>
        </div>

        <div className="grid gap-8 mb-8">
          <div className="flex flex-col justify-start">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h2 className="text-lg text-gray-600 mb-2">Current Price</h2>
              <p className="text-4xl font-bold text-green-600">
                {data.current_price}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Price History</h2>
            <div className="h-64">
              <PriceChart prices={JSON.parse(data.price_history)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProductPage);
