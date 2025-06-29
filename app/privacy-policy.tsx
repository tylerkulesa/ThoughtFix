import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Shield size={48} color="#6366f1" strokeWidth={2} />
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
          </Text>
          
          <Text style={styles.subsectionTitle}>Personal Information:</Text>
          <Text style={styles.bulletPoint}>• Name and email address</Text>
          <Text style={styles.bulletPoint}>• Demographic information (age range, gender) - optional</Text>
          <Text style={styles.bulletPoint}>• Professional information (job title) - optional</Text>
          
          <Text style={styles.subsectionTitle}>Usage Information:</Text>
          <Text style={styles.bulletPoint}>• Thoughts and text you submit for reframing</Text>
          <Text style={styles.bulletPoint}>• App usage patterns and preferences</Text>
          <Text style={styles.bulletPoint}>• Device information and technical data</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the information we collect to provide, maintain, and improve our services:
          </Text>
          <Text style={styles.bulletPoint}>• Provide AI-powered thought reframing services</Text>
          <Text style={styles.bulletPoint}>• Personalize your experience based on therapeutic frameworks</Text>
          <Text style={styles.bulletPoint}>• Track your progress and usage patterns</Text>
          <Text style={styles.bulletPoint}>• Process subscription payments and manage your account</Text>
          <Text style={styles.bulletPoint}>• Send important updates about our services</Text>
          <Text style={styles.bulletPoint}>• Improve our AI models and therapeutic approaches</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following limited circumstances:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who assist in operating our app (Supabase, OpenAI, Stripe)</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
          <Text style={styles.bulletPoint}>• In connection with a business transfer or acquisition</Text>
          
          <Text style={styles.subsectionTitle}>Third-Party Services:</Text>
          <Text style={styles.sectionText}>
            We use trusted third-party services to provide our functionality:
          </Text>
          <Text style={styles.bulletPoint}>• OpenAI for AI-powered thought reframing</Text>
          <Text style={styles.bulletPoint}>• Supabase for secure data storage</Text>
          <Text style={styles.bulletPoint}>• Stripe for payment processing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement appropriate security measures to protect your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
          <Text style={styles.bulletPoint}>• Secure authentication and access controls</Text>
          <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
          <Text style={styles.bulletPoint}>• Limited access to personal data by authorized personnel only</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights and Choices</Text>
          <Text style={styles.sectionText}>
            You have the following rights regarding your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Access and review your personal data</Text>
          <Text style={styles.bulletPoint}>• Update or correct your information</Text>
          <Text style={styles.bulletPoint}>• Delete your account and associated data</Text>
          <Text style={styles.bulletPoint}>• Export your data in a portable format</Text>
          <Text style={styles.bulletPoint}>• Opt out of non-essential communications</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.sectionText}>
            We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your account and data at any time through the app settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. International Users</Text>
          <Text style={styles.sectionText}>
            If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          <Text style={styles.bulletPoint}>• Email: privacy@thoughtfix.app</Text>
          <Text style={styles.bulletPoint}>• Through the app's support feature</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using ThoughtFix, you acknowledge that you have read and understood this Privacy Policy.
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
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});