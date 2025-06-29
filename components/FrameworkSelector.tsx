import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Check, ChevronDown, Brain } from 'lucide-react-native';
import { 
  TherapeuticFramework, 
  getFrameworkDisplayName, 
  getFrameworkDescription 
} from '@/lib/openai';

interface FrameworkSelectorProps {
  selectedFramework: TherapeuticFramework;
  onFrameworkChange: (framework: TherapeuticFramework) => void;
  disabled?: boolean;
}

const FRAMEWORKS: TherapeuticFramework[] = [
  'cbt',
  'act', 
  'dbt',
  'mindfulness',
  'positive',
  'stoic',
  'compassion',
  'solution',
  'narrative'
];

export default function FrameworkSelector({ 
  selectedFramework, 
  onFrameworkChange, 
  disabled = false 
}: FrameworkSelectorProps) {
  const [showModal, setShowModal] = useState(false);

  const handleFrameworkSelect = (framework: TherapeuticFramework) => {
    onFrameworkChange(framework);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.selectorDisabled]}
        onPress={() => !disabled && setShowModal(true)}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          <Brain size={20} color="#6366f1" strokeWidth={2} />
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>Therapeutic Approach</Text>
            <Text style={styles.selectorSubtitle}>
              {getFrameworkDisplayName(selectedFramework)}
            </Text>
          </View>
        </View>
        <ChevronDown size={20} color="#6b7280" strokeWidth={2} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Therapeutic Approach</Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)} 
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.frameworkList}>
              {FRAMEWORKS.map((framework) => (
                <TouchableOpacity
                  key={framework}
                  style={[
                    styles.frameworkOption,
                    selectedFramework === framework && styles.frameworkOptionSelected
                  ]}
                  onPress={() => handleFrameworkSelect(framework)}
                >
                  <View style={styles.frameworkInfo}>
                    <Text style={[
                      styles.frameworkName,
                      selectedFramework === framework && styles.frameworkNameSelected
                    ]}>
                      {getFrameworkDisplayName(framework)}
                    </Text>
                    <Text style={styles.frameworkDescription}>
                      {getFrameworkDescription(framework)}
                    </Text>
                  </View>
                  {selectedFramework === framework && (
                    <Check size={20} color="#6366f1" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectorDisabled: {
    opacity: 0.6,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectorText: {
    flex: 1,
  },
  selectorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 2,
  },
  selectorSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
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
    maxHeight: '80%',
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
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: '#6b7280',
  },
  frameworkList: {
    maxHeight: 400,
  },
  frameworkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  frameworkOptionSelected: {
    backgroundColor: '#eef2ff',
  },
  frameworkInfo: {
    flex: 1,
    marginRight: 12,
  },
  frameworkName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  frameworkNameSelected: {
    color: '#6366f1',
  },
  frameworkDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
});