import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { ArrowRight, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to ThoughtFix',
    description: 'Reframe your negative thoughts using psychology-backed techniques and AI.',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Choose Your Framework',
    description: 'Pick from CBT, ACT, Stoicism, and more to match your mindset.',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Track Your Growth',
    description: 'Save your thoughts and measure your mindset progress over time.',
    gradient: ['#4facfe', '#00f2fe'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      // Animate to next slide
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentSlide)(currentSlide + 1);
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      onComplete(); // Continue anyway
    }
  };

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(opacity.value, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${((currentSlide + 1) / slides.length) * 100}%`),
    };
  });

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentSlideData.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Progress Bar - Moved to very top */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <X size={24} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
        </TouchableOpacity>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Content */}
          <Animated.View style={[styles.content, slideAnimatedStyle]}>
            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{currentSlideData.title}</Text>
              <Text style={styles.description}>{currentSlideData.description}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Next/Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {isLastSlide ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Slide Indicators - Moved to bottom under button */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentSlide && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  skipButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 140,
    paddingBottom: 160,
    paddingHorizontal: 20,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320, // Constrain width for better readability
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    maxWidth: 300,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 200,
    left: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 400,
    right: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});