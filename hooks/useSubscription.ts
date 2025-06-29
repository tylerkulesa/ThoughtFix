import { useEffect, useState } from 'react';
import { getUserSubscription } from '@/lib/stripe';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSubscription();
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = subscription?.subscription_status === 'active';
  const isTrialing = subscription?.subscription_status === 'trialing';
  const hasActiveSubscription = isPremium || isTrialing;

  return {
    subscription,
    loading,
    error,
    isPremium,
    isTrialing,
    hasActiveSubscription,
    refetch: fetchSubscription,
  };
}