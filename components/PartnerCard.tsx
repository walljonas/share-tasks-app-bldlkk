
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Partner } from '@/types/Task';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';
import { GlassView } from 'expo-glass-effect';

interface PartnerCardProps {
  partner: Partner;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
}

export default function PartnerCard({ partner, onAccept, onDecline, onPress }: PartnerCardProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const getStatusColor = () => {
    switch (partner.status) {
      case 'accepted':
        return '#34C759';
      case 'declined':
        return '#FF3B30';
      case 'pending':
        return '#FF9500';
      default:
        return theme.colors.text;
    }
  };

  const getStatusIcon = () => {
    switch (partner.status) {
      case 'accepted':
        return 'checkmark.circle.fill';
      case 'declined':
        return 'xmark.circle.fill';
      case 'pending':
        return 'clock.fill';
      default:
        return 'person.circle';
    }
  };

  return (
    <GlassView
      style={[
        styles.container,
        colorScheme !== 'ios' && {
          backgroundColor: theme.dark
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.05)',
        },
      ]}
      glassEffectStyle="regular"
    >
      <Pressable onPress={onPress} style={styles.content}>
        <View style={styles.avatar}>
          <IconSymbol name="person.circle.fill" size={40} color={theme.colors.primary} />
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{partner.name}</Text>
          <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>
            {partner.email}
          </Text>
          
          <View style={styles.statusContainer}>
            <IconSymbol
              name={getStatusIcon()}
              size={16}
              color={getStatusColor()}
            />
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {partner.status === 'pending' && (onAccept || onDecline) && (
          <View style={styles.actions}>
            {onAccept && (
              <Pressable onPress={onAccept} style={[styles.actionButton, styles.acceptButton]}>
                <IconSymbol name="checkmark" size={16} color="white" />
              </Pressable>
            )}
            {onDecline && (
              <Pressable onPress={onDecline} style={[styles.actionButton, styles.declineButton]}>
                <IconSymbol name="xmark" size={16} color="white" />
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
});
