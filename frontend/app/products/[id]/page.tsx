'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import PriceChart from '@/components/shared/price-history-graph';
import { withAuth } from '@/app/hoc/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [thresholdValue, setThresholdValue] = useState<number>(100);

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

  const deleteProduct = useMutation({
    mutationFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: params?.id }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/products');
    },
  });

  const setThreshold = useMutation({
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/setThreshold`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: params?.id, threshold: thresholdValue }),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', params?.id] });
    },
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
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-4">
            <a
              href={data.url}
              className="text-blue-600 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Product Page
            </a>
          </div>
        </div>

        <div className="grid gap-6 mb-6">
          <div className="flex flex-col justify-start">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div>
                  <h2 className="text-lg text-gray-600 mb-1">Current Price</h2>
                  <p className="text-3xl font-bold text-green-600">
                    {data.current_price}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg text-gray-600 mb-1">Threshold</h2>
                  <p className="text-3xl font-bold text-red-600">
                    £{data.threshold}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <div className="flex-grow w-full">
              <Input
                type="number"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(Number(e.target.value))}
                className="w-full"
                placeholder="Enter threshold"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setThreshold.mutate()}
              className="w-full md:w-auto"
              disabled={setThreshold.isLoading}
            >
              {setThreshold.isLoading ? 'Setting...' : 'Set Threshold'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteProduct.mutate()}
              className="w-full md:w-auto"
            >
              Delete Product
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Price History</h2>
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
