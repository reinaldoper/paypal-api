import { Request, Response } from 'express';
import paypalClient from '../config/paypal';
import * as paypal from '@paypal/checkout-server-sdk';
import { createOrderSchema } from '../schemas/createOrderSchema';


/**
 * Creates a PayPal order based on the request body data.
 * 
 * Validates the input data using a predefined schema. If the validation fails, 
 * it responds with a 400 status code and an error message. If the validation 
 * succeeds, a PayPal order is created with the provided value, currency code, 
 * description, invoice ID, and items. The function then sends a request to 
 * PayPal's API to create an order with intent to capture payment.
 * 
 * If the order creation is successful, it responds with a 201 status code, 
 * including the order ID, status, and an approval URL. If the order creation 
 * fails, it responds with a 500 status code and an error message.
 * 
 * @param req - The Express request object containing the order details in the body.
 * @param res - The Express response object used to send back the response.
 */

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
