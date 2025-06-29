import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { TherapeuticFramework } from '@/lib/openai';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: string;
  job: string;
  isPremium: boolean;
  weeklyReframeCount: number;
  weekStartDate: Date;
  preferredFramework: TherapeuticFramework;
}

export function useUserData() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  
  const [userData, setUserData] = useState<UserData>({
    firstName: user?.user_metadata?.first_name || 'User',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    gender: 'prefer_not_to_say',
    age: 'prefer_not_to_say',
    job: '',
    isPremium: false,
    weeklyReframeCount: 2, // Set to 2 to show user has used 2/3 free reframes
    weekStartDate: new Date(), // Current week start
    preferredFramework: 'cbt', // Default to CBT
  });

  // Update premium status when subscription changes
  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      isPremium,
      firstName: user?.user_metadata?.first_name || prev.firstName,
      lastName: user?.user_metadata?.last_name || prev.lastName,
      email: user?.email || prev.email,
    }));
  }, [isPremium, user]);

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const updateFramework = (framework: TherapeuticFramework) => {
    setUserData(prev => ({ ...prev, preferredFramework: framework }));
  };

  const incrementReframeCount = () => {
    setUserData(prev => ({
      ...prev,
      weeklyReframeCount: prev.weeklyReframeCount + 1
    }));
  };

  const resetWeeklyCount = () => {
    setUserData(prev => ({
      ...prev,
      weeklyReframeCount: 0,
      weekStartDate: new Date()
    }));
  };

  // Check if it's a new week and reset count if needed
  useEffect(() => {
    const now = new Date();
    const weekStart = new Date(userData.weekStartDate);
    const daysDiff = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 7) {
      resetWeeklyCount();
    }
  }, [userData.weekStartDate]);

  const canReframe = userData.isPremium || userData.weeklyReframeCount < 3;
  const remainingReframes = userData.isPremium ? Infinity : Math.max(0, 3 - userData.weeklyReframeCount);

  return {
    userData,
    updateUserData,
    updateFramework,
    incrementReframeCount,
    resetWeeklyCount,
    canReframe,
    remainingReframes
  };
}