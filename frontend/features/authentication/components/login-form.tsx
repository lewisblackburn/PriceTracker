import { useForm } from 'react-hook-form';
import { loginSchema } from '../schemas/login.schema';
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

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@example.com',
      password: 'mypassword',
    },
  });

  const loginMutation = useMutation(
    async (data: z.infer<typeof loginSchema>) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`,
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
        throw new Error(responseData.error || 'Login failed');
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
          description: error.message || 'An error occurred during login',
          closeButton: true,
        });
      },
    }
  );

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-[300px] max-w-[400px]"
      >
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
                This is your email address. It will be used to login to your
                account.
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
                This is your password. It will be used to login to your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loginMutation.isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
