import { z } from 'zod';

export const createOrderSchema = z.object({
  value: z.union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'O valor deve ser um número positivo.',
    }),
  currency_code: z.enum(['USD', 'EUR', 'BRL']),
  description: z.string().optional(),
  invoice_id: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      quantity: z.number().int().positive(),
      unit_price: z.union([z.string(), z.number()])
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0),
      category: z.enum(['PHYSICAL_GOODS', 'DIGITAL_GOODS']),
    })
  ).min(1),
});