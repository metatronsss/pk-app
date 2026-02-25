import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = secretKey ? new Stripe(secretKey) : null;

export const isStripeEnabled = !!stripe;

/** USD：penaltyCents 即為 Stripe amount（美金分），$10 = 1000 */
export function toStripeAmount(penaltyCents: number): number {
  return penaltyCents;
}
