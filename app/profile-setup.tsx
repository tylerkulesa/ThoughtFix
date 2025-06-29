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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Check, ChevronDown, User, Calendar, Users, Briefcase, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

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

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState('prefer_not_to_say');
  const [selectedAge, setSelectedAge] = useState('prefer_not_to_say');
  const [job, setJob] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 2;
  const isStep1Valid = firstName.trim() && lastName.trim();

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update user profile in the database
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          gender: selectedGender,
          age_range: selectedAge,
          job: job.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (updateError) {
        throw updateError;
      }

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
    setShowGenderModal(false);
  };

  const handleAgeSelect = (value: string) => {
    setSelectedAge(value);
    setShowAgeModal(false);
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
                onPress={() => onSelect(option.value)}
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

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Let's get to know you</Text>
        <Text style={styles.stepSubtitle}>Tell us your name to personalize your experience</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name *</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#6b7280" strokeWidth={2} />
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name *</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#6b7280" strokeWidth={2} />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Tell us about yourself</Text>
        <Text style={styles.stepSubtitle}>This information helps us provide more personalized insights (optional)</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
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
          <Text style={styles.label}>Age Range</Text>
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
          <Text style={styles.label}>Job/Profession</Text>
          <View style={styles.inputContainer}>
            <Briefcase size={20} color="#6b7280" strokeWidth={2} />
            <TextInput
              style={styles.input}
              value={job}
              onChangeText={setJob}
              placeholder="e.g., Teacher, Engineer, Student"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>

      <View style={styles.privacyNotice}>
        <Text style={styles.privacyTitle}>Privacy Notice</Text>
        <Text style={styles.privacyText}>
          Your information is used solely to improve our AI recommendations and is never shared with third parties. You can update or remove this information at any time.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
            </TouchableOpacity>
          )}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Profile Setup</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep} of {totalSteps}</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              (currentStep === 1 && !isStep1Valid) && styles.nextButtonDisabled,
              loading && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={(currentStep === 1 && !isStep1Valid) || loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? 'Saving...' : currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <SelectionModal
          visible={showGenderModal}
          onClose={() => setShowGenderModal(false)}
          title="Select Gender"
          options={GENDER_OPTIONS}
          selectedValue={selectedGender}
          onSelect={handleGenderSelect}
        />

        <SelectionModal
          visible={showAgeModal}
          onClose={() => setShowAgeModal(false)}
          title="Select Age Range"
          options={AGE_RANGES}
          selectedValue={selectedAge}
          onSelect={handleAgeSelect}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
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
  privacyNotice: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369a1',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0369a1',
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});