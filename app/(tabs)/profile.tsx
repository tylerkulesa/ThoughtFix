import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Moon, Shield, CircleHelp as HelpCircle, Heart, ChevronRight, LogOut, Award, Target, Calendar, Crown, Zap, Star, TestTube, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { useUserData } from '@/hooks/useUserData';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { userData } = useUserData();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  const handlePremiumPurchase = (plan: string) => {
    // Handle premium purchase logic here
    console.log('Purchasing premium plan:', plan);
    setShowPremiumModal(false);
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={20} color={color} strokeWidth={2} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightComponent 
  }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color="#6366f1" strokeWidth={2} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && !rightComponent && (
          <ChevronRight size={20} color="#9ca3af" strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#6366f1" strokeWidth={2} />
              {userData.isPremium && (
                <View style={styles.premiumBadge}>
                  <Crown size={12} color="#f59e0b" strokeWidth={2} />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
                {userData.isPremium && (
                  <View style={styles.premiumTag}>
                    <Crown size={14} color="#f59e0b" strokeWidth={2} />
                    <Text style={styles.premiumTagText}>Premium</Text>
                  </View>
                )}
              </View>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* Premium Upgrade Banner */}
        {!userData.isPremium && (
          <TouchableOpacity style={styles.premiumBanner} onPress={() => setShowPremiumModal(true)}>
            <View style={styles.premiumBannerContent}>
              <Crown size={24} color="#f59e0b" strokeWidth={2} />
              <View style={styles.premiumBannerText}>
                <Text style={styles.premiumBannerTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumBannerSubtitle}>
                  {userData.weeklyReframeCount}/3 free reframes used this week
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6366f1" strokeWidth={2} />
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard 
            icon={Target}
            title="Total Reframes"
            value="47"
            color="#6366f1"
          />
          <StatCard 
            icon={Calendar}
            title="Days Active"
            value="23"
            color="#059669"
          />
          <StatCard 
            icon={Award}
            title="Streak"
            value="7"
            color="#f59e0b"
          />
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Daily reminders and insights"
              showChevron={false}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                  thumbColor="#ffffff"
                />
              }
            />
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              showChevron={false}
              rightComponent={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                  thumbColor="#ffffff"
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Settings}
              title="Account Settings"
              subtitle="Manage your account details"
              onPress={() => router.push('/(tabs)/account-settings')}
            />
            {!userData.isPremium && (
              <SettingItem
                icon={Crown}
                title="Upgrade to Premium"
                subtitle="Unlock all features"
                onPress={() => setShowPremiumModal(true)}
              />
            )}
            <SettingItem
              icon={Shield}
              title="Privacy & Security"
              subtitle="Control your privacy settings"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => {}}
            />
            <SettingItem
              icon={FileText}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => router.push('/privacy-policy')}
            />
            <SettingItem
              icon={FileText}
              title="Terms of Service"
              subtitle="Our terms and conditions"
              onPress={() => router.push('/terms-of-service')}
            />
            <SettingItem
              icon={Heart}
              title="Rate the App"
              subtitle="Share your feedback"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={TestTube}
              title="Reframe Tester"
              subtitle="Test AI reframing functionality"
              onPress={() => router.push('/reframe-tester')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" strokeWidth={2} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>ThoughtFix Powered by Aivory v1.0.0</Text>
        </View>
      </ScrollView>

      <PremiumUpgradeModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handlePremiumPurchase}
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#f59e0b',
    textTransform: 'uppercase',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  premiumBanner: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  premiumBannerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});