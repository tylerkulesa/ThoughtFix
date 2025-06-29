import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  User, 
  Calendar, 
  Users, 
  Briefcase,
  Crown,
  Zap,
  Star,
  Shield
} from 'lucide-react-native';
import { router } from 'expo-router';

const GENDER_OPTIONS = [
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non_binary' },
  { label: 'Other', value: 'other' },
];

const AGE_RANGES = [
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  { label: '13-17', value: '13-17' },
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45-54', value: '45-54' },
  { label: '55-64', value: '55-64' },
  { label: '65+', value: '65+' },
];

const PREMIUM_FEATURES = [
  { icon: Zap, title: 'Unlimited Reframes', description: 'No daily limits on thought reframing' },
  { icon: Star, title: 'Advanced AI Insights', description: 'Deeper analysis and personalized recommendations' },
  { icon: Shield, title: 'Priority Support', description: '24/7 premium customer support' },
  { icon: Crown, title: 'Exclusive Content', description: 'Access to premium exercises and techniques' },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState('prefer_not_to_say');
  const [selectedAge, setSelectedAge] = useState('prefer_not_to_say');
  const [job, setJob] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isStep1Valid = firstName.trim() && lastName.trim() && email.trim();
  const isStep2Valid = true; // Age and gender are optional

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinueFree = () => {
    // Save user data and navigate to main app
    router.replace('/(tabs)');
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumPurchase = (plan: string) => {
    // Handle premium purchase logic here
    console.log('Purchasing premium plan:', plan);
    setShowPremiumModal(false);
    router.replace('/(tabs)');
  };

  const getGenderLabel = () => {
    return GENDER_OPTIONS.find(option => option.value === selectedGender)?.label || 'Select Gender';
  };

  const getAgeLabel = () => {
    return AGE_RANGES.find(option => option.value === selectedAge)?.label || 'Select Age Range';
  };

  const SelectionModal = ({ 
    visible, 
    onClose, 
    title, 
    options, 
    selectedValue, 
    onSelect 
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedValue === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Check size={20} color="#6366f1" strokeWidth={2} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const PremiumModal = () => (
    <Modal
      visible={showPremiumModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPremiumModal(false)}
    >
      <View style={styles.premiumModalOverlay}>
        <View style={styles.premiumModalContent}>
          <TouchableOpacity 
            style={styles.premiumCloseButton}
            onPress={() => setShowPremiumModal(false)}
          >
            <Text style={styles.premiumCloseText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.premiumHeader}>
              <Crown size={48} color="#f59e0b" strokeWidth={2} />
              <Text style={styles.premiumTitle}>Unlock Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Get unlimited access to all features and transform your mindset faster
              </Text>
            </View>

            <View style={styles.premiumFeatures}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.premiumFeature}>
                  <View style={styles.premiumFeatureIcon}>
                    <feature.icon size={24} color="#6366f1" strokeWidth={2} />
                  </View>
                  <View style={styles.premiumFeatureText}>
                    <Text style={styles.premiumFeatureTitle}>{feature.title}</Text>
                    <Text style={styles.premiumFeatureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.premiumPlans}>
              <TouchableOpacity 
                style={[styles.premiumPlan, styles.premiumPlanPopular]}
                onPress={() => handlePremiumPurchase('yearly')}
              >
                <View style={styles.premiumPlanBadge}>
                  <Text style={styles.premiumPlanBadgeText}>MOST POPULAR</Text>
                </View>
                <Text style={styles.premiumPlanTitle}>Yearly</Text>
                <Text style={styles.premiumPlanPrice}>$59.99/year</Text>
                <Text style={styles.premiumPlanSavings}>Save 50%</Text>
                <Text style={styles.premiumPlanDescription}>$4.99 per month, billed annually</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.premiumPlan}
                onPress={() => handlePremiumPurchase('monthly')}
              >
                <Text style={styles.premiumPlanTitle}>Monthly</Text>
                <Text style={styles.premiumPlanPrice}>$9.99/month</Text>
                <Text style={styles.premiumPlanDescription}>Billed monthly, cancel anytime</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.continueFreeButtom}
              onPress={() => {
                setShowPremiumModal(false);
                handleContinueFree();
              }}
            >
              <Text style={styles.continueFreeText}>Continue with Free Version</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Welcome to ThoughtFix</Text>
      <Text style={styles.stepSubtitle}>Let's get to know you better</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender (Optional)</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowGenderModal(true)}
        >
          <View style={styles.selectContent}>
            <Users size={20} color="#6b7280" strokeWidth={2} />
            <Text style={[
              styles.selectText,
              selectedGender === 'prefer_not_to_say' && styles.selectPlaceholder
            ]}>
              {getGenderLabel()}
            </Text>
          </View>
          <ChevronDown size={20} color="#6b7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Age Range (Optional)</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowAgeModal(true)}
        >
          <View style={styles.selectContent}>
            <Calendar size={20} color="#6b7280" strokeWidth={2} />
            <Text style={[
              styles.selectText,
              selectedAge === 'prefer_not_to_say' && styles.selectPlaceholder
            ]}>
              {getAgeLabel()}
            </Text>
          </View>
          <ChevronDown size={20} color="#6b7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Job/Profession (Optional)</Text>
        <TextInput
          style={styles.input}
          value={job}
          onChangeText={setJob}
          placeholder="e.g., Teacher, Engineer, Student"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Plan</Text>
      <Text style={styles.stepSubtitle}>Start your journey to better mental wellness</Text>

      <View style={styles.planOptions}>
        <View style={styles.freePlan}>
          <Text style={styles.planTitle}>Free Plan</Text>
          <Text style={styles.planPrice}>$0/month</Text>
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <Check size={16} color="#059669" strokeWidth={2} />
              <Text style={styles.planFeatureText}>5 reframes per day</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color="#059669" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Basic AI insights</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color="#059669" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Progress tracking</Text>
            </View>
          </View>
        </View>

        <View style={styles.premiumPlanPreview}>
          <View style={styles.premiumBadge}>
            <Crown size={16} color="#f59e0b" strokeWidth={2} />
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
          <Text style={styles.planTitle}>Premium Plan</Text>
          <Text style={styles.planPrice}>$9.99/month</Text>
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <Check size={16} color="#6366f1" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Unlimited reframes</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color="#6366f1" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Advanced AI insights</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color="#6366f1" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Priority support</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={16} color="#6366f1" strokeWidth={2} />
              <Text style={styles.planFeatureText}>Exclusive content</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.planButtons}>
        <TouchableOpacity style={styles.premiumButton} onPress={handleUpgradePremium}>
          <Crown size={20} color="#ffffff" strokeWidth={2} />
          <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.freeButton} onPress={handleContinueFree}>
          <Text style={styles.freeButtonText}>Continue with Free</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep} of 3</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.nextButton,
                (currentStep === 1 && !isStep1Valid) && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={currentStep === 1 && !isStep1Valid}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ArrowRight size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}

        {/* Modals */}
        <SelectionModal
          visible={showGenderModal}
          onClose={() => setShowGenderModal(false)}
          title="Select Gender"
          options={GENDER_OPTIONS}
          selectedValue={selectedGender}
          onSelect={setSelectedGender}
        />

        <SelectionModal
          visible={showAgeModal}
          onClose={() => setShowAgeModal(false)}
          title="Select Age Range"
          options={AGE_RANGES}
          selectedValue={selectedAge}
          onSelect={setSelectedAge}
        />

        <PremiumModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  selectPlaceholder: {
    color: '#9ca3af',
  },
  planOptions: {
    gap: 16,
    marginBottom: 32,
  },
  freePlan: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  premiumPlanPreview: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
    marginBottom: 16,
  },
  planFeatures: {
    gap: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  planButtons: {
    gap: 12,
  },
  premiumButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  premiumButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  freeButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  freeButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  nextButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 20,
    color: '#6b7280',
  },
  modalOptions: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  modalOptionSelected: {
    backgroundColor: '#eef2ff',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  modalOptionTextSelected: {
    color: '#6366f1',
    fontFamily: 'Inter-Medium',
  },
  premiumModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  premiumModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  premiumCloseButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  premiumCloseText: {
    fontSize: 24,
    color: '#6b7280',
  },
  premiumHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  premiumTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  premiumFeatures: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  premiumFeatureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumFeatureText: {
    flex: 1,
  },
  premiumFeatureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  premiumFeatureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  premiumPlans: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  premiumPlan: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  premiumPlanPopular: {
    borderColor: '#6366f1',
    backgroundColor: '#fafbff',
  },
  premiumPlanBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumPlanBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  premiumPlanTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  premiumPlanPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  premiumPlanSavings: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  premiumPlanDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  continueFreeButtom: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  continueFreeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});