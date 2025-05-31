"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'O valor deve ser um número positivo.',
    }),
    currency_code: zod_1.z.enum(['USD', 'EUR', 'BRL']),
    description: zod_1.z.string().optional(),
    invoice_id: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive(),
        unit_price: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
            .refine((val) => !isNaN(Number(val)) && Number(val) > 0),
        category: zod_1.z.enum(['PHYSICAL_GOODS', 'DIGITAL_GOODS']),
    })).min(1),
});
