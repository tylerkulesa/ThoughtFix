import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Calendar, Lightbulb, TrendingUp, Crown, Lock } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useUserData } from '@/hooks/useUserData';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

interface Reframe {
  id: string;
  originalThought: string;
  reframedThought: string;
  timestamp: Date;
  category: string;
}

const SAMPLE_HISTORY: Reframe[] = [
  {
    id: '1',
    originalThought: "I'm terrible at presentations",
    reframedThought: "I'm learning and improving with each presentation I give",
    timestamp: new Date(2024, 0, 15),
    category: 'Self-Confidence'
  },
  {
    id: '2',
    originalThought: "I always mess things up",
    reframedThought: "Mistakes are opportunities to learn and grow stronger",
    timestamp: new Date(2024, 0, 14),
    category: 'Growth Mindset'
  },
  {
    id: '3',
    originalThought: "Nobody likes me",
    reframedThought: "I have meaningful connections, and I'm worthy of friendship",
    timestamp: new Date(2024, 0, 13),
    category: 'Social Connection'
  },
  {
    id: '4',
    originalThought: "I'll never be successful",
    reframedThought: "Success is a journey, and I'm making progress every day",
    timestamp: new Date(2024, 0, 12),
    category: 'Career Growth'
  },
  {
    id: '5',
    originalThought: "I'm not smart enough",
    reframedThought: "Intelligence comes in many forms, and I have unique strengths",
    timestamp: new Date(2024, 0, 11),
    category: 'Self-Worth'
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { userData } = useUserData();
  const categories = ['All', 'Self-Confidence', 'Growth Mindset', 'Social Connection', 'Career Growth', 'Self-Worth'];
  
  const filteredHistory = SAMPLE_HISTORY.filter(item => {
    const matchesSearch = item.originalThought.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.reframedThought.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePremiumUpgrade = (plan: string) => {
    console.log('Upgrading to premium:', plan);
    setShowPremiumModal(false);
    // Handle premium upgrade logic here
  };

  if (!userData.isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <View style={styles.statsContainer}>
            <Lock size={20} color="#6b7280" strokeWidth={2} />
            <Text style={styles.statsText}>Premium Only</Text>
          </View>
        </View>

        {/* Blurred Content */}
        <View style={styles.premiumBlockedContainer}>
          <BlurView intensity={20} style={styles.blurredContent}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#6b7280" strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your reframes..."
                  placeholderTextColor="#9ca3af"
                  editable={false}
                />
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
              contentContainerStyle={styles.categoryContent}
            >
              {categories.map((category) => (
                <View
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive
                  ]}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive
                  ]}>
                    {category}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {filteredHistory.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Lightbulb size={16} color="#6366f1" strokeWidth={2} />
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Calendar size={14} color="#6b7280" strokeWidth={2} />
                      <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.thoughtContainer}>
                    <Text style={styles.originalLabel}>Original Thought:</Text>
                    <Text style={styles.originalThought}>"{item.originalThought}"</Text>
                  </View>
                  
                  <View style={styles.reframeContainer}>
                    <Text style={styles.reframeLabel}>Reframed:</Text>
                    <Text style={styles.reframedThought}>{item.reframedThought}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </BlurView>

          {/* Premium Upgrade Overlay */}
          <View style={styles.premiumOverlay}>
            <View style={styles.premiumOverlayContent}>
              <Crown size={64} color="#f59e0b" strokeWidth={2} />
              <Text style={styles.premiumOverlayTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumOverlaySubtitle}>
                View your complete reframe history and track your progress over time
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => setShowPremiumModal(true)}
              >
                <Crown size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.upgradeButtonText}>Unlock History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Premium Upgrade Modal */}
        <PremiumUpgradeModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={handlePremiumUpgrade}
          title="Unlock Your Journey"
          subtitle="Access your complete reframe history and track your mental wellness progress"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <View style={styles.statsContainer}>
          <TrendingUp size={20} color="#059669" strokeWidth={2} />
          <Text style={styles.statsText}>{SAMPLE_HISTORY.length} reframes</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your reframes..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category && styles.categoryChipTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* History List */}
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {filteredHistory.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Lightbulb size={16} color="#6366f1" strokeWidth={2} />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <View style={styles.dateContainer}>
                <Calendar size={14} color="#6b7280" strokeWidth={2} />
                <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
            
            <View style={styles.thoughtContainer}>
              <Text style={styles.originalLabel}>Original Thought:</Text>
              <Text style={styles.originalThought}>"{item.originalThought}"</Text>
            </View>
            
            <View style={styles.reframeContainer}>
              <Text style={styles.reframeLabel}>Reframed:</Text>
              <Text style={styles.reframedThought}>{item.reframedThought}</Text>
            </View>
          </View>
        ))}
        
        {filteredHistory.length === 0 && (
          <View style={styles.emptyState}>
            <Lightbulb size={48} color="#d1d5db" strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>No reframes found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try adjusting your search terms' : 'Start reframing thoughts to see your history here'}
            </Text>
          </View>
        )}
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  premiumBlockedContainer: {
    flex: 1,
    position: 'relative',
  },
  blurredContent: {
    flex: 1,
  },
  premiumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  premiumOverlayContent: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  premiumOverlayTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  premiumOverlaySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  thoughtContainer: {
    marginBottom: 16,
  },
  originalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  originalThought: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    fontStyle: 'italic',
  },
  reframeContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reframeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  reframedThought: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});