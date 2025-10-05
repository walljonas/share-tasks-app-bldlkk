
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

interface InvitePartnerModalProps {
  onClose: () => void;
  onInvite: (email: string, name: string) => void;
}

export default function InvitePartnerModal({ onClose, onInvite }: InvitePartnerModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please enter both name and email');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    onInvite(email.trim(), name.trim());
    onClose();
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Invite Partner</Text>
        <Pressable onPress={handleInvite} style={styles.inviteButton}>
          <Text style={[styles.inviteButtonText, { color: theme.colors.primary }]}>Send</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <GlassView
          style={[
            styles.section,
            colorScheme !== 'ios' && {
              backgroundColor: theme.dark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
            },
          ]}
          glassEffectStyle="regular"
        >
          <View style={styles.iconContainer}>
            <IconSymbol name="person.badge.plus" size={48} color={theme.colors.primary} />
          </View>
          
          <Text style={[styles.description, { color: theme.dark ? '#98989D' : '#666' }]}>
            Invite a partner to collaborate on tasks. They&apos;ll receive an invitation to join your workspace.
          </Text>
          
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.text,
                borderColor: theme.dark ? '#333' : '#ddd',
              },
            ]}
            placeholder="Partner's name"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.text,
                borderColor: theme.dark ? '#333' : '#ddd',
              },
            ]}
            placeholder="Partner's email"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  inviteButton: {
    padding: 4,
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
});
