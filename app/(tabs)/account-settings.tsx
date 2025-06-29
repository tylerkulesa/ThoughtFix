import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check, ChevronDown, User, Calendar, Users } from 'lucide-react-native';
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

export default function AccountSettingsScreen() {
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [selectedGender, setSelectedGender] = useState('prefer_not_to_say');
  const [selectedAge, setSelectedAge] = useState('prefer_not_to_say');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // Here you would typically save to your backend
    Alert.alert(
      'Settings Saved',
      'Your account settings have been updated successfully.',
      [{ text: 'OK', onPress: () => setHasChanges(false) }]
    );
  };

  const handleInputChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setHasChanges(true);
  };

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
    setShowGenderModal(false);
    setHasChanges(true);
  };

  const handleAgeSelect = (value: string) => {
    setSelectedAge(value);
    setShowAgeModal(false);
    setHasChanges(true);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={handleInputChange(setFirstName)}
              placeholder="Enter your first name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={handleInputChange(setLastName)}
              placeholder="Enter your last name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleInputChange(setEmail)}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Demographics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <Text style={styles.sectionDescription}>
            This information helps us provide more personalized insights and improve our services.
          </Text>

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
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>Privacy Notice</Text>
          <Text style={styles.privacyText}>
            Your demographic information is used solely to improve our AI recommendations and is never shared with third parties. You can update or remove this information at any time.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      {hasChanges && (
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
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
  privacyNotice: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
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
  saveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
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