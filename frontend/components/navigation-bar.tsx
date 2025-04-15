'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuth from '@/app/hooks/useAuth';
import Notifications from '@/features/notifications/components/notifications';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95">
      <div className="flex h-14 items-center px-4 md:container md:px-6 mx-auto">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Price Tracker
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center">
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {isLoggedIn ? (
            <>
              <Notifications />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <User className="h-4 w-4" />
                    <span>{user?.email || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="h-8 px-3" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-3" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-1 justify-end md:hidden">
          <Notifications />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col gap-4 py-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground rounded-md',
                      pathname === item.href
                        ? 'font-medium text-foreground bg-accent/50'
                        : 'text-muted-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-2 border-t px-4 pt-6">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="font-medium text-sm">
                        {user?.email || 'Account'}
                      </div>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full px-2 rounded-md"
                          asChild
                        >
                          <Link href="/profile">Profile</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start w-full px-2 rounded-md text-red-500 hover:text-red-500 hover:bg-red-50/50"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full px-2 rounded-md"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full px-2 rounded-md"
                        asChild
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
