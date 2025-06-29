import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '@/screens/OnboardingScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState<boolean | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Check if user has seen onboarding
    AsyncStorage.getItem('hasSeenOnboarding').then((value) => {
      setShowOnboarding(value !== 'true');
    });
  }, []);

  useEffect(() => {
    // Check if authenticated user needs profile setup
    if (user && showOnboarding === false) {
      checkProfileSetup();
    }
  }, [user, showOnboarding]);

  const checkProfileSetup = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking profile:', error);
        setNeedsProfileSetup(false); // Default to not needing setup on error
        return;
      }

      // If no user record exists or first_name/last_name are empty, need setup
      const needsSetup = !data || !data.first_name?.trim() || !data.last_name?.trim();
      setNeedsProfileSetup(needsSetup);
    } catch (err) {
      console.error('Error checking profile setup:', err);
      setNeedsProfileSetup(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (loading || showOnboarding === null || (user && needsProfileSetup === null)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="(auth)" />
        ) : needsProfileSetup ? (
          <Stack.Screen name="profile-setup" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        <Stack.Screen name="success" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
});