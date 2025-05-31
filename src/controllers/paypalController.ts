import { Request, Response } from 'express';
import paypalClient from '../config/paypal';
import * as paypal from '@paypal/checkout-server-sdk';
import { createOrderSchema } from '../schemas/createOrderSchema';


export const createOrder = async (req: Request, res: Response) => {
  const parseResult = createOrderSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Dados inválidos',
      issues: parseResult.error.errors,
    });
  }

  const { value, currency_code, description, invoice_id, items } = parseResult.data;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');

  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code,
          value: value.toString(),
          breakdown: {
            item_total: {
              currency_code,
              value: value.toString(),
            },
            discount: {
              currency_code,
              value: '0.00',
            },
            handling: {
              currency_code,
              value: '0.00',
            },
            insurance: {
              currency_code,
              value: '0.00',
            },
            shipping: {
              currency_code,
              value: '0.00',
            },
            shipping_discount: {
              currency_code,
              value: '0.00',
            },
            tax_total: {
              currency_code,
              value: '0.00',
            },
          },
        },
        description,
        invoice_id,
        custom_id: `ref-${Date.now()}`,
        items: items.map((item) => ({
          name: item.name,
          description: item.description || '',
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code,
            value: item.unit_price.toString(),
          },
          category: item.category,
        })),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
     const approveLink = order.result.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href;

    return res.status(201).json({
      id: order.result.id,
      status: order.result.status,
      approveUrl: approveLink,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar o pedido' });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  const { orderID } = req.params;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);

  try {
    const capture = await paypalClient.execute(request);
    return res.status(200).json({ message: 'Pagamento capturado com sucesso', capture: capture.result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao capturar o pagamento', details: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
};
