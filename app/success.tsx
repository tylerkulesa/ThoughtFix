import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { CircleCheck as CheckCircle, Crown, ArrowRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function SuccessScreen() {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session_id) {
      fetchSubscriptionData();
    }
  }, [session_id]);

  const fetchSubscriptionData = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setError('Failed to load subscription data');
      } else {
        setSubscriptionData(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Confirming your subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchSubscriptionData}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <CheckCircle size={80} color="#059669" strokeWidth={2} />
            <View style={styles.crownBadge}>
              <Crown size={24} color="#f59e0b" strokeWidth={2} />
            </View>
          </View>

          <Text style={styles.title}>Welcome to Premium!</Text>
          <Text style={styles.subtitle}>
            Your subscription has been activated successfully. You now have access to all premium features.
          </Text>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What's included:</Text>
            <View style={styles.featuresList}>
              <View style={styles.feature}>
                <CheckCircle size={20} color="#059669" strokeWidth={2} />
                <Text style={styles.featureText}>Unlimited thought reframes</Text>
              </View>
              <View style={styles.feature}>
                <CheckCircle size={20} color="#059669" strokeWidth={2} />
                <Text style={styles.featureText}>Advanced AI insights</Text>
              </View>
              <View style={styles.feature}>
                <CheckCircle size={20} color="#059669" strokeWidth={2} />
                <Text style={styles.featureText}>Complete reframe history</Text>
              </View>
              <View style={styles.feature}>
                <CheckCircle size={20} color="#059669" strokeWidth={2} />
                <Text style={styles.featureText}>Priority support</Text>
              </View>
            </View>
          </View>

          {subscriptionData && (
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>Subscription Details</Text>
              <Text style={styles.subscriptionText}>
                Status: <Text style={styles.subscriptionStatus}>
                  {subscriptionData.subscription_status?.replace('_', ' ').toUpperCase()}
                </Text>
              </Text>
              {subscriptionData.current_period_end && (
                <Text style={styles.subscriptionText}>
                  Next billing: {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Start Using Premium</Text>
            <ArrowRight size={20} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  crownBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  subscriptionInfo: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subscriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});