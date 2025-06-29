import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <FileText size={48} color="#6366f1" strokeWidth={2} />
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.subtitle}>
            Please read these terms carefully before using ThoughtFix. By using our service, you agree to these terms.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using ThoughtFix ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.sectionText}>
            ThoughtFix is a mental wellness application that provides AI-powered thought reframing services using various therapeutic frameworks. The Service includes:
          </Text>
          <Text style={styles.bulletPoint}>• AI-powered thought reframing and cognitive restructuring</Text>
          <Text style={styles.bulletPoint}>• Multiple therapeutic framework options (CBT, ACT, etc.)</Text>
          <Text style={styles.bulletPoint}>• Progress tracking and thought history</Text>
          <Text style={styles.bulletPoint}>• Premium subscription features</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Medical Disclaimer</Text>
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Important Medical Disclaimer</Text>
            <Text style={styles.warningText}>
              ThoughtFix is NOT a substitute for professional medical advice, diagnosis, or treatment. Our service is designed for educational and self-help purposes only.
            </Text>
          </View>
          <Text style={styles.bulletPoint}>• Always seek the advice of qualified mental health professionals</Text>
          <Text style={styles.bulletPoint}>• Do not disregard professional medical advice because of something you read in the app</Text>
          <Text style={styles.bulletPoint}>• If you are experiencing a mental health crisis, contact emergency services immediately</Text>
          <Text style={styles.bulletPoint}>• The AI-generated content should not be considered professional therapy or counseling</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Accounts and Registration</Text>
          <Text style={styles.sectionText}>
            To use certain features of the Service, you must register for an account. You agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate and complete information during registration</Text>
          <Text style={styles.bulletPoint}>• Maintain the security of your password and account</Text>
          <Text style={styles.bulletPoint}>• Notify us immediately of any unauthorized use of your account</Text>
          <Text style={styles.bulletPoint}>• Be responsible for all activities that occur under your account</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
          <Text style={styles.sectionText}>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
          </Text>
          <Text style={styles.bulletPoint}>• Use the Service for any illegal or unauthorized purpose</Text>
          <Text style={styles.bulletPoint}>• Submit harmful, threatening, or inappropriate content</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the Service or other users' accounts</Text>
          <Text style={styles.bulletPoint}>• Use the Service to harm minors in any way</Text>
          <Text style={styles.bulletPoint}>• Reverse engineer or attempt to extract the source code of the Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Subscription and Payment Terms</Text>
          <Text style={styles.sectionText}>
            ThoughtFix offers both free and premium subscription services:
          </Text>
          
          <Text style={styles.subsectionTitle}>Free Service:</Text>
          <Text style={styles.bulletPoint}>• Limited number of reframes per week</Text>
          <Text style={styles.bulletPoint}>• Basic therapeutic frameworks</Text>
          <Text style={styles.bulletPoint}>• Standard support</Text>
          
          <Text style={styles.subsectionTitle}>Premium Subscription:</Text>
          <Text style={styles.bulletPoint}>• Unlimited thought reframes</Text>
          <Text style={styles.bulletPoint}>• Advanced AI insights and analysis</Text>
          <Text style={styles.bulletPoint}>• Complete thought history access</Text>
          <Text style={styles.bulletPoint}>• Priority customer support</Text>
          
          <Text style={styles.subsectionTitle}>Payment Terms:</Text>
          <Text style={styles.bulletPoint}>• Subscriptions are billed in advance on a monthly or annual basis</Text>
          <Text style={styles.bulletPoint}>• Payment will be charged to your chosen payment method</Text>
          <Text style={styles.bulletPoint}>• Subscriptions automatically renew unless cancelled</Text>
          <Text style={styles.bulletPoint}>• You may cancel your subscription at any time through your account settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cancellation and Refunds</Text>
          <Text style={styles.sectionText}>
            You may cancel your subscription at any time. Upon cancellation:
          </Text>
          <Text style={styles.bulletPoint}>• You will continue to have access to premium features until the end of your billing period</Text>
          <Text style={styles.bulletPoint}>• Your account will revert to the free tier after the billing period ends</Text>
          <Text style={styles.bulletPoint}>• Refunds are generally not provided for partial billing periods</Text>
          <Text style={styles.bulletPoint}>• Refunds may be considered on a case-by-case basis for technical issues</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
          <Text style={styles.sectionText}>
            The Service and its original content, features, and functionality are owned by ThoughtFix and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Text>
          <Text style={styles.bulletPoint}>• You retain ownership of the content you submit to the Service</Text>
          <Text style={styles.bulletPoint}>• You grant us a license to use your content to provide and improve the Service</Text>
          <Text style={styles.bulletPoint}>• You may not copy, modify, or distribute our proprietary content</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Privacy and Data Protection</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Disclaimers and Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            The Service is provided "as is" and "as available" without any warranties of any kind. To the fullest extent permitted by law:
          </Text>
          <Text style={styles.bulletPoint}>• We disclaim all warranties, express or implied</Text>
          <Text style={styles.bulletPoint}>• We do not guarantee the accuracy or reliability of AI-generated content</Text>
          <Text style={styles.bulletPoint}>• We are not liable for any indirect, incidental, or consequential damages</Text>
          <Text style={styles.bulletPoint}>• Our total liability shall not exceed the amount you paid for the Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Indemnification</Text>
          <Text style={styles.sectionText}>
            You agree to defend, indemnify, and hold harmless ThoughtFix and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Termination</Text>
          <Text style={styles.sectionText}>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Governing Law</Text>
          <Text style={styles.sectionText}>
            These Terms shall be interpreted and governed by the laws of the United States, without regard to conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the appropriate courts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Contact Information</Text>
          <Text style={styles.sectionText}>
            If you have any questions about these Terms of Service, please contact us:
          </Text>
          <Text style={styles.bulletPoint}>• Email: legal@thoughtfix.app</Text>
          <Text style={styles.bulletPoint}>• Through the app's support feature</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using ThoughtFix, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  warningBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    lineHeight: 20,
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