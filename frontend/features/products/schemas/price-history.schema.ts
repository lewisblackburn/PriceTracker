import { z } from 'zod';

export const priceHistorySchema = z.object({
  id: z.number(),
  price: z.number(),
});
