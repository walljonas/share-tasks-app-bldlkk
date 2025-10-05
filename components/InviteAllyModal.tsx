
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  useColorScheme,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

interface InviteAllyModalProps {
  onClose: () => void;
  onInvite: (email: string, name: string) => void;
}

export default function InviteAllyModal({ onClose, onInvite }: InviteAllyModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleInvite = () => {
    if (!email.trim() || !name.trim()) {
      Alert.alert('Missing Information', 'Please enter both name and email to invite your ally');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    onInvite(email.trim(), name.trim());
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Invite Quest Ally</Text>
        <Pressable onPress={handleInvite} style={[styles.inviteButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.inviteButtonText}>Send Invite</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <GlassView
          style={[
            styles.formContainer,
            colorScheme !== 'ios' && { backgroundColor: colors.surface },
          ]}
          glassEffectStyle="regular"
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
              <IconSymbol name="person.badge.plus" size={32} color="white" />
            </View>
          </View>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            Invite a Friend to Join Your Quests
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Send an invitation to a friend so you can share quests, collaborate on adventures, and earn XP together!
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Ally Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundAlt,
                },
              ]}
              placeholder="Enter their name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </div>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Email Address
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundAlt,
                },
              ]}
              placeholder="Enter their email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={[styles.benefitsTitle, { color: colors.text }]}>
              Quest Ally Benefits:
            </Text>
            
            <View style={styles.benefitItem}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={16} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Share and collaborate on quests
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <IconSymbol name="person.fill.checkmark" size={16} color={colors.success} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Assign quests to each other
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <IconSymbol name="star.fill" size={16} color={colors.warning} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Earn bonus XP for teamwork
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={16} color={colors.accent} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Track progress together
              </Text>
            </View>
          </View>
        </GlassView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  inviteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: colors.surface,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  benefitsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    flex: 1,
  },
});
