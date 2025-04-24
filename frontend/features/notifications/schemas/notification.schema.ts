import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  url: z.string(),
  is_read: z.boolean(),
  created_at: z.string(),
});

export const markAsReadSchema = z.object({
  notification_id: z.number(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type MarkAsRead = z.infer<typeof markAsReadSchema>;
