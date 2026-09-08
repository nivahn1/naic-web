import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(STRIPE_SECRET_KEY);

/** Server-only. Never import this from a Client Component. */
export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : null;
