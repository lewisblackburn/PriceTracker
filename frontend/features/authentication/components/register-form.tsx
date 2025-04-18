import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { registerSchema } from '../schemas/register.schema';

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation(
    async (data: z.infer<typeof registerSchema>) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();

      if (!response.ok || !responseData.token) {
        throw new Error(responseData.error || 'Registration failed');
      }
      return responseData;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        router.push('/');
      },
      onError: (error: Error) => {
        toast.error('Error', {
          icon: <Lock className="size-4" />,
          description: error.message || 'An error occurred during registration',
          closeButton: true,
        });
      },
    }
  );

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match', {
        icon: <Lock className="size-4" />,
        closeButton: true,
      });
      return;
    }

    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@user.com" {...field} />
              </FormControl>
              <FormDescription>
                An email address is required to register.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Make sure to use a strong password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>Please confirm your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={registerMutation.isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
