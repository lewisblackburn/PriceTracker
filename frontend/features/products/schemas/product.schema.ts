import { z } from 'zod';
import { priceHistorySchema } from './price-history.schema';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  current_price: z.string(),
  price_history: z.array(priceHistorySchema),
});

export const createProductSchema = productSchema.omit({
  id: true,
  name: true,
  current_price: true,
  price_history: true,
});
export const updateProductSchema = productSchema.omit({ id: true });
export const deleteProductSchema = z.object({
  id: z.number(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type DeleteProduct = z.infer<typeof deleteProductSchema>;
