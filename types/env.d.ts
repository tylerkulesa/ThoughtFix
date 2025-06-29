declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // OpenAI Configuration
      EXPO_PUBLIC_OPENAI_API_KEY: string;
      
      // Supabase Configuration
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      
      // Stripe Configuration (for server-side)
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}

// Ensure this file is treated as a module
export {};