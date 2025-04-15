'use client';

import { withAuth } from '@/app/hoc/withAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateProduct,
  createProductSchema,
} from '@/features/products/schemas/product.schema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function CreateProductPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const router = useRouter();
  const form = useForm<CreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { url: '' },
  });

  const {
    mutate: createProduct,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async (data: CreateProduct) =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/products/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'An error occurred');
          });
        }
        return res.json();
      }),
    onSuccess: (responseData: { id: string }) => {
      router.push(`/products/${responseData.id}`);
    },
  });

  const onSubmit = (data: CreateProduct) => {
    createProduct(data);
  };

  if (!token)
    return (
      <div className="flex items-center justify-center h-64">
        Loading token...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {(error as Error).message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">Create Product</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default withAuth(CreateProductPage);
