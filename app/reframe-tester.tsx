import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Brain } from 'lucide-react-native';
import { router } from 'expo-router';
import { generateReframe, TherapeuticFramework, getFrameworkDisplayName } from '@/lib/openai';
import FrameworkSelector from '@/components/FrameworkSelector';

export default function ReframeTesterScreen() {
  const [thought, setThought] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<TherapeuticFramework>('cbt');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendToAI = async () => {
    if (!thought.trim()) {
      Alert.alert('Error', 'Please enter a thought to reframe.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const reframedThought = await generateReframe(thought.trim(), selectedFramework);
      setResult(reframedThought);
    } catch (err: any) {
      console.error('Error calling OpenAI:', err);
      setError(err.message || 'Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
    setThought('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reframe Tester</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Brain size={32} color="#6366f1" strokeWidth={2} />
          <Text style={styles.instructionsTitle}>Test AI Reframing</Text>
          <Text style={styles.instructionsText}>
            This is a test screen to verify the AI reframing functionality with different therapeutic frameworks. 
            Enter a negative thought and select a framework to see how the AI responds.
          </Text>
        </View>

        {/* Framework Selection */}
        <View style={styles.frameworkSection}>
          <FrameworkSelector
            selectedFramework={selectedFramework}
            onFrameworkChange={setSelectedFramework}
            disabled={loading}
          />
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter a negative thought:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., I'm terrible at everything..."
            placeholderTextColor="#9ca3af"
            value={thought}
            onChangeText={setThought}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (loading || !thought.trim()) && styles.sendButtonDisabled
          ]}
          onPress={handleSendToAI}
          disabled={loading || !thought.trim()}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.sendButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Send size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.sendButtonText}>Send to AI</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Results Section */}
        {(result || error) && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>AI Response</Text>
              <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {result && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>
                  Reframed using {getFrameworkDisplayName(selectedFramework)}:
                </Text>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            )}
          </View>
        )}

        {/* Debug Info */}
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Debug Info</Text>
          <Text style={styles.debugText}>
            Framework: {getFrameworkDisplayName(selectedFramework)}
          </Text>
          <Text style={styles.debugText}>
            Thought Length: {thought.length} characters
          </Text>
          <Text style={styles.debugText}>
            OpenAI API: {process.env.EXPO_PUBLIC_OPENAI_API_KEY ? 'Configured' : 'Not configured'}
          </Text>
        </View>
      </ScrollView>
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
  instructionsContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  instructionsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  frameworkSection: {
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  resultsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    lineHeight: 20,
  },
  resultContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369a1',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0369a1',
    lineHeight: 20,
  },
  debugSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  debugTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 4,
  },
});