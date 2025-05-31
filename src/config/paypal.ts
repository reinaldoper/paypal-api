import * as paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const Environment = process.env.PAYPAL_MODE === 'live'
  ? paypal.core.LiveEnvironment
  : paypal.core.SandboxEnvironment;

const paypalEnv = new Environment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);

const paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);
export default paypalClient;