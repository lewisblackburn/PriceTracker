'use client';

import ProductCard from '@/features/products/components/product-card';
import { Product } from '@/features/products/schemas/product.schema';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { withAuth } from '@/app/hoc/withAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ProductsPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/create">
          <Button>Add Product</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default withAuth(ProductsPage);
