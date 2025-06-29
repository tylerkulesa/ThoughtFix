import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Crown, Zap, Star, Shield } from 'lucide-react-native';
import { createCheckoutSession } from '@/lib/stripe';
import { getPremiumProduct } from '@/src/stripe-config';

const PREMIUM_FEATURES = [
  { icon: Zap, title: 'Unlimited Reframes', description: 'No weekly limits on thought reframing' },
  { icon: Star, title: 'Advanced AI Insights', description: 'Deeper analysis and personalized recommendations' },
  { icon: Shield, title: 'Priority Support', description: '24/7 premium customer support' },
  { icon: Crown, title: 'Exclusive Content', description: 'Access to premium exercises and techniques' },
];

interface PremiumUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: (plan: string) => void;
  title?: string;
  subtitle?: string;
}

export default function PremiumUpgradeModal({ 
  visible, 
  onClose, 
  onUpgrade,
  title = "Unlock Premium",
  subtitle = "Get unlimited access to all features and transform your mindset faster"
}: PremiumUpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const premiumProduct = getPremiumProduct();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError('');

      const { url } = await createCheckoutSession({
        priceId: premiumProduct.priceId,
        mode: premiumProduct.mode,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: window.location.href,
      });

      if (url) {
        await Linking.openURL(url);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Crown size={48} color="#f59e0b" strokeWidth={2} />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.features}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <View style={styles.featureIcon}>
                    <feature.icon size={24} color="#6366f1" strokeWidth={2} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.planContainer}>
              <View style={styles.plan}>
                <Text style={styles.planTitle}>{premiumProduct.name}</Text>
                <Text style={styles.planPrice}>{premiumProduct.price}</Text>
                <Text style={styles.planDescription}>{premiumProduct.description}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.upgradeButton, loading && styles.upgradeButtonDisabled]}
                onPress={handleUpgrade}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Crown size={20} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: '#6b7280',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    textAlign: 'center',
  },
  planContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  plan: {
    backgroundColor: '#fafbff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  upgradeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});