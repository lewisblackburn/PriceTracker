import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
})
