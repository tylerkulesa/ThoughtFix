export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
  price: string;
  features: string[];
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SWoFR4Ija77Xng',
    priceId: 'price_1RbkcmCH9CdfWcnZDDE4bg7s',
    name: 'ThoughtFix Premium',
    description: 'Unlock unlimited reframes and advanced AI insights to transform your mindset faster',
    mode: 'subscription',
    price: '$3.99/month',
    features: [
      'Unlimited thought reframes',
      'Advanced AI insights and analysis',
      'Complete reframe history access',
      'Priority customer support',
      'Exclusive premium content',
      'Progress tracking and analytics'
    ]
  }
];

export const getPremiumProduct = () => STRIPE_PRODUCTS[0];