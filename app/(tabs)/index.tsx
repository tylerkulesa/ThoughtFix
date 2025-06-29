import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, User, BookOpen, Lightbulb, Crown, Zap, Loader, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';
import { useUserData } from '@/hooks/useUserData';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import FrameworkSelector from '@/components/FrameworkSelector';
import { generateReframe } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface Reframe {
  id: string;
  originalThought: string;
  reframedThought: string;
  supportivePassage: string;
  timestamp: Date;
  category: string;
}

const SAMPLE_REFRAMES: Reframe[] = [
  {
    id: '1',
    originalThought: "I'm terrible at presentations",
    reframedThought: "I'm learning and improving with each presentation I give",
    supportivePassage: "Remember that everyone starts somewhere, and each presentation is an opportunity to grow. Your nervousness shows that you care about doing well, which is actually a strength. Focus on your message and the value you're bringing to your audience.",
    timestamp: new Date(),
    category: 'Self-Confidence'
  },
  {
    id: '2',
    originalThought: "I always mess things up",
    reframedThought: "Mistakes are opportunities to learn and grow stronger",
    supportivePassage: "Making mistakes is part of being human and learning. What matters most is how you respond to setbacks and what you learn from them. Each 'mistake' is actually valuable feedback that helps you improve.",
    timestamp: new Date(),
    category: 'Growth Mindset'
  },
];

// Helper function to parse AI response and extract reframed thought and supportive passage
function parseAIResponse(aiResponse: string): { reframedThought: string; supportivePassage: string } {
  // Look for the "**Reframed thought:**" pattern
  const reframedMatch = aiResponse.match(/\*\*Reframed thought:\*\*\s*"([^"]+)"/);
  
  if (reframedMatch) {
    const reframedThought = reframedMatch[1];
    // Remove the reframed thought section from the response to get the supportive passage
    const supportivePassage = aiResponse.replace(/\*\*Reframed thought:\*\*\s*"[^"]+"\s*$/, '').trim();
    
    return {
      reframedThought,
      supportivePassage
    };
  }
  
  // Fallback: if no specific format found, use the whole response as supportive passage
  return {
    reframedThought: "Your thoughts have been reframed with a more positive perspective",
    supportivePassage: aiResponse
  };
}

export default function ReframeScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reframes, setReframes] = useState<Reframe[]>(SAMPLE_REFRAMES);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [lastFailedThought, setLastFailedThought] = useState('');
  
  const { userData, incrementReframeCount, canReframe, remainingReframes, updateFramework } = useUserData();
  
  const sidebarAnimation = useSharedValue(0);
  const overlayAnimation = useSharedValue(0);

  const toggleSidebar = () => {
    const newValue = sidebarVisible ? 0 : 1;
    sidebarAnimation.value = withSpring(newValue, {
      damping: 20,
      stiffness: 90,
    });
    overlayAnimation.value = withTiming(newValue, { duration: 300 });
    setSidebarVisible(!sidebarVisible);
  };

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            sidebarAnimation.value,
            [0, 1],
            [-width * 0.8, 0]
          ),
        },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayAnimation.value,
      pointerEvents: overlayAnimation.value > 0 ? 'auto' : 'none',
    };
  });

  const saveThoughtToDatabase = async (originalThought: string, reframedThought: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('thoughts')
        .insert({
          user_id: user.id,
          original_text: originalThought,
          reframed_text: reframedThought,
          category: 'Personal Growth'
        });

      if (error) {
        console.error('Error saving thought:', error);
        throw new Error('Failed to save to database');
      }
    } catch (err) {
      console.error('Error saving to database:', err);
      throw err;
    }
  };

  const validateInput = (text: string): string | null => {
    if (!text.trim()) {
      return 'Please enter a thought to reframe.';
    }
    
    if (text.trim().length < 3) {
      return 'Please enter a more detailed thought (at least 3 characters).';
    }
    
    if (text.length > 1000) {
      return 'Please keep your thought under 1000 characters.';
    }
    
    return null;
  };

  const simulateNetworkError = () => {
    // For testing purposes - simulate network issues
    setIsOnline(false);
    setTimeout(() => setIsOnline(true), 5000);
  };

  const handleReframe = async (thoughtToReframe?: string) => {
    const thoughtText = thoughtToReframe || inputText.trim();
    
    // Input validation
    const validationError = validateInput(thoughtText);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!canReframe) {
      setShowPremiumModal(true);
      return;
    }

    // Check if offline
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      setLastFailedThought(thoughtText);
      return;
    }

    setIsLoading(true);
    setError('');
    setLastFailedThought('');
    
    try {
      // Generate reframe using OpenAI with selected framework
      const aiResponse = await generateReframe(thoughtText, userData.preferredFramework);
      
      // Parse the AI response to extract reframed thought and supportive passage
      const { reframedThought, supportivePassage } = parseAIResponse(aiResponse);
      
      const newReframe: Reframe = {
        id: Date.now().toString(),
        originalThought: thoughtText,
        reframedThought,
        supportivePassage,
        timestamp: new Date(),
        category: 'Personal Growth'
      };
      
      // Save to database (save the full AI response)
      await saveThoughtToDatabase(thoughtText, aiResponse);
      
      // Update local state
      setReframes([newReframe, ...reframes]);
      if (!thoughtToReframe) {
        setInputText('');
      }
      incrementReframeCount();
      setRetryCount(0);
      
    } catch (err: any) {
      console.error('Error generating reframe:', err);
      setLastFailedThought(thoughtText);
      setRetryCount(prev => prev + 1);
      
      // Provide specific error messages based on error type
      if (err.message?.includes('API key')) {
        setError('AI service configuration error. Please contact support.');
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.message?.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.message?.includes('database')) {
        setError('Failed to save your reframe. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedThought) {
      handleReframe(lastFailedThought);
    } else {
      handleReframe();
    }
  };

  const clearError = () => {
    setError('');
    setLastFailedThought('');
    setRetryCount(0);
  };

  const handlePremiumUpgrade = (plan: string) => {
    console.log('Upgrading to premium:', plan);
    setShowPremiumModal(false);
    // Handle premium upgrade logic here
  };

  // Markdown styles for better formatting
  const markdownStyles = {
    body: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: '#059669',
      lineHeight: 24,
    },
    strong: {
      fontFamily: 'Inter-SemiBold',
      color: '#047857',
    },
    paragraph: {
      marginBottom: 8,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <BookOpen size={24} color="#6366f1" strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>ThoughtFix</Text>
            <Text style={styles.headerSubtitle}>Powered by Aivory</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.profileButton}>
              <User size={24} color="#6366f1" strokeWidth={2} />
            </TouchableOpacity>
            <View style={[styles.networkIndicator, !isOnline && styles.networkIndicatorOffline]}>
              {isOnline ? (
                <Wifi size={16} color="#059669" strokeWidth={2} />
              ) : (
                <WifiOff size={16} color="#ef4444" strokeWidth={2} />
              )}
            </View>
          </View>
        </View>

        {/* Usage Limit Banner for Free Users */}
        {!userData.isPremium && (
          <View style={styles.usageBanner}>
            <View style={styles.usageBannerContent}>
              <Zap size={20} color="#f59e0b" strokeWidth={2} />
              <View style={styles.usageBannerText}>
                <Text style={styles.usageBannerTitle}>
                  {remainingReframes} reframes remaining this week
                </Text>
                <Text style={styles.usageBannerSubtitle}>
                  Upgrade to Premium for unlimited reframes
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Crown size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Framework Selector */}
          <View style={styles.frameworkSection}>
            <FrameworkSelector
              selectedFramework={userData.preferredFramework}
              onFrameworkChange={updateFramework}
              disabled={isLoading}
            />
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>What's on your mind?</Text>
            <TextInput
              style={[styles.textInput, error && styles.textInputError]}
              placeholder="Type your negative thought or emotion here..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                if (error) clearError(); // Clear error when user starts typing
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
              maxLength={1000}
            />
            
            {/* Character Counter */}
            <Text style={styles.characterCounter}>
              {inputText.length}/1000 characters
            </Text>
            
            {/* Error Display */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                {lastFailedThought ? (
                  <View style={styles.errorActions}>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={handleRetry}
                      disabled={isLoading}
                    >
                      <RefreshCw size={16} color="#6366f1" strokeWidth={2} />
                      <Text style={styles.retryButtonText}>
                        Retry{retryCount > 0 ? ` (${retryCount})` : ''}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.clearErrorButton}
                      onPress={clearError}
                    >
                      <Text style={styles.clearErrorButtonText}>Dismiss</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {/* Network Test Button (for testing) */}
                {__DEV__ && (
                  <TouchableOpacity 
                    style={styles.testButton}
                    onPress={simulateNetworkError}
                  >
                    <Text style={styles.testButtonText}>Test Network Error</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            <TouchableOpacity 
              style={[
                styles.reframeButton, 
                (isLoading || !canReframe || !inputText.trim()) && styles.reframeButtonDisabled
              ]}
              onPress={() => handleReframe()}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <>
                  <Loader size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.reframeButtonText}>AI is thinking...</Text>
                </>
              ) : !canReframe ? (
                <>
                  <Crown size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.reframeButtonText}>Upgrade to Continue</Text>
                </>
              ) : (
                <>
                  <Send size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.reframeButtonText}>Reframe Thought</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Recent Reframes */}
          {reframes.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Reframes</Text>
              {reframes.slice(0, 3).map((reframe) => (
                <View key={reframe.id} style={styles.reframeCard}>
                  <View style={styles.reframeHeader}>
                    <Lightbulb size={16} color="#6366f1" strokeWidth={2} />
                    <Text style={styles.reframeCategory}>{reframe.category}</Text>
                  </View>
                  <Text style={styles.originalThought}>"{reframe.originalThought}"</Text>
                  
                  {/* Reframed Thought - Black text at the top */}
                  <View style={styles.reframedThoughtContainer}>
                    <Text style={styles.reframedThought}>"{reframe.reframedThought}"</Text>
                  </View>
                  
                  {/* Supportive Passage - Scrollable container */}
                  <ScrollView 
                    style={styles.supportivePassageContainer}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    <Markdown style={markdownStyles}>
                      {reframe.supportivePassage}
                    </Markdown>
                  </ScrollView>
                  
                  {/* Reframe Another Button */}
                  <TouchableOpacity 
                    style={styles.reframeAnotherButton}
                    onPress={() => {
                      setInputText(reframe.originalThought);
                      // Scroll to top to show input
                    }}
                  >
                    <RefreshCw size={16} color="#6366f1" strokeWidth={2} />
                    <Text style={styles.reframeAnotherButtonText}>Reframe Again</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Sidebar Overlay */}
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableOpacity style={styles.overlayTouch} onPress={toggleSidebar} />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View style={[styles.sidebar, sidebarStyle]}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Saved Reframes</Text>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.sidebarContent}>
            {reframes.map((reframe) => (
              <TouchableOpacity key={reframe.id} style={styles.sidebarItem}>
                <Text style={styles.sidebarItemTitle} numberOfLines={2}>
                  {reframe.originalThought}
                </Text>
                <Text style={styles.sidebarItemCategory}>{reframe.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Premium Upgrade Modal */}
        <PremiumUpgradeModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handlePremiumUpgrade}
          title="Weekly Limit Reached"
          subtitle="You've used all 3 free reframes this week. Upgrade to Premium for unlimited access."
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
  menuButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    padding: 8,
  },
  networkIndicator: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
  },
  networkIndicatorOffline: {
    backgroundColor: '#fef2f2',
  },
  usageBanner: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  usageBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  usageBannerText: {
    flex: 1,
  },
  usageBannerTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400e',
    marginBottom: 2,
  },
  usageBannerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#b45309',
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  frameworkSection: {
    marginTop: 20,
  },
  inputSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minHeight: 120,
    marginBottom: 8,
  },
  textInputError: {
    borderColor: '#ef4444',
  },
  characterCounter: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    marginBottom: 12,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
  },
  clearErrorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  clearErrorButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  testButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  reframeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reframeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  reframeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  reframeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reframeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reframeCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  originalThought: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  reframedThoughtContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1f2937',
  },
  reframedThought: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    lineHeight: 26,
  },
  supportivePassageContainer: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    marginBottom: 12,
  },
  reframeAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignSelf: 'flex-start',
  },
  reframeAnotherButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 40,
  },
  sidebarTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    padding: 4,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sidebarItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  sidebarItemTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 4,
  },
  sidebarItemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});