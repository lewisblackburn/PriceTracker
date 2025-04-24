import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Notification } from '../schemas/notification.schema';
import { useRouter } from 'next/navigation';

export const Notifications = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/notifications/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
    enabled: !!token,
    // NOTE: Refetch notifications every 60 seconds
    refetchInterval: 60000,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/notifications/markAsRead`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notification_id: selectedNotification?.id }),
        }
      ),
    onSuccess: () => {
      router.push(selectedNotification?.url ?? '/');
      setSelectedNotification(null);
      queryClient.invalidateQueries(['notifications']);
    },
    // NOTE: Still navigate to the URL even if the request fails
    onError: () => {
      router.push(selectedNotification?.url ?? '/');
      setSelectedNotification(null);
      queryClient.invalidateQueries(['notifications']);
    },
  });

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 relative">
            {notifications?.length > 0 && (
              <div
                className="absolute  h-2 w-2 bg-destructive"
                style={{
                  borderRadius: '9999px',
                  top: 6,
                  right: 10,
                }}
              />
            )}
            <Bell className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          style={{ width: '24rem' }}
          className="!max-h-60 overflow-y-auto"
        >
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications?.length ? (
            notifications.map((notification: Notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => {
                  setSelectedNotification(notification);
                  markAsRead();
                }}
              >
                <div className="flex flex-col">
                  <span className="font-bold">{notification.title}</span>
                  <span className="text-muted-foreground ml-2">
                    {notification.message}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
