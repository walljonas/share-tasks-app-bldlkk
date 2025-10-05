
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from '@/components/IconSymbol';
import { useTasks } from '@/hooks/useTasks';
import PartnerCard from '@/components/PartnerCard';
import InvitePartnerModal from '@/components/InvitePartnerModal';
import CreateTaskForPartnerModal from '@/components/CreateTaskForPartnerModal';
import * as Haptics from 'expo-haptics';

export default function PartnersScreen() {
  const theme = useTheme();
  const {
    partners,
    tasks,
    loading,
    invitePartner,
    updatePartnerStatus,
    createTaskForPartner,
  } = useTasks();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleInvitePartner = async (email: string, name: string) => {
    await invitePartner(email, name);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAcceptPartner = async (partnerId: string) => {
    await updatePartnerStatus(partnerId, 'accepted');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeclinePartner = async (partnerId: string) => {
    Alert.alert(
      'Decline Partner',
      'Are you sure you want to decline this partner invitation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            await updatePartnerStatus(partnerId, 'declined');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const handleCreateTaskForPartner = async (taskData: any) => {
    if (selectedPartner) {
      await createTaskForPartner(selectedPartner, taskData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedPartner(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const acceptedPartners = partners.filter(p => p.status === 'accepted');
  const declinedPartners = partners.filter(p => p.status === 'declined');

  const getTasksForPartner = (partnerId: string) => {
    return tasks.filter(task => 
      task.assignedTo === partnerId || 
      task.sharedWith.includes(partnerId) ||
      task.collaborators.includes(partnerId)
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setShowInviteModal(true)}
      style={styles.headerButton}
    >
      <IconSymbol name="person.badge.plus" color={theme.colors.primary} size={20} />
    </Pressable>
  );

  const renderStats = () => (
    <GlassView
      style={[
        styles.statsContainer,
        Platform.OS !== 'ios' && {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        },
      ]}
      glassEffectStyle="regular"
    >
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
          {acceptedPartners.length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Active Partners
        </Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: '#FF9500' }]}>
          {pendingPartners.length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Pending
        </Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: '#34C759' }]}>
          {tasks.filter(t => t.sharedWith.length > 0).length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Shared Tasks
        </Text>
      </View>
    </GlassView>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Partners",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* Header for non-iOS platforms */}
          {Platform.OS !== 'ios' && (
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Partners
              </Text>
              {renderHeaderRight()}
            </View>
          )}

          {/* Stats */}
          {renderStats()}

          {/* Welcome message for new users */}
          {partners.length === 0 && (
            <GlassView
              style={[
                styles.welcomeContainer,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="person.2.fill" size={48} color={theme.colors.primary} />
              <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
                Collaborate with Partners
              </Text>
              <Text style={[styles.welcomeText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Invite partners to share tasks, create tasks for each other, and collaborate on projects together.
              </Text>
              <Pressable
                onPress={() => setShowInviteModal(true)}
                style={[styles.welcomeButton, { backgroundColor: theme.colors.primary }]}
              >
                <IconSymbol name="person.badge.plus" size={16} color="white" />
                <Text style={styles.welcomeButtonText}>Invite Partner</Text>
              </Pressable>
            </GlassView>
          )}

          {/* Pending Partners */}
          {pendingPartners.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Pending Invitations ({pendingPartners.length})
              </Text>
              {pendingPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onAccept={() => handleAcceptPartner(partner.id)}
                  onDecline={() => handleDeclinePartner(partner.id)}
                />
              ))}
            </View>
          )}

          {/* Active Partners */}
          {acceptedPartners.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Active Partners ({acceptedPartners.length})
              </Text>
              {acceptedPartners.map((partner) => {
                const partnerTasks = getTasksForPartner(partner.id);
                return (
                  <View key={partner.id} style={styles.partnerSection}>
                    <PartnerCard
                      partner={partner}
                      onPress={() => console.log('Partner pressed:', partner.id)}
                    />
                    
                    <View style={styles.partnerActions}>
                      <Pressable
                        onPress={() => {
                          setSelectedPartner(partner.id);
                          setShowCreateTaskModal(true);
                        }}
                        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                      >
                        <IconSymbol name="plus" size={16} color="white" />
                        <Text style={styles.actionButtonText}>Create Task</Text>
                      </Pressable>
                      
                      <Text style={[styles.taskCount, { color: theme.dark ? '#98989D' : '#666' }]}>
                        {partnerTasks.length} shared tasks
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Declined Partners */}
          {declinedPartners.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Declined ({declinedPartners.length})
              </Text>
              {declinedPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Invite Partner Modal */}
        <Modal
          visible={showInviteModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <InvitePartnerModal
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvitePartner}
          />
        </Modal>

        {/* Create Task for Partner Modal */}
        <Modal
          visible={showCreateTaskModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <CreateTaskForPartnerModal
            onClose={() => {
              setShowCreateTaskModal(false);
              setSelectedPartner(null);
            }}
            onCreateTask={handleCreateTaskForPartner}
            partnerId={selectedPartner}
            partnerName={acceptedPartners.find(p => p.id === selectedPartner)?.name || ''}
          />
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerButton: {
    padding: 8,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  welcomeContainer: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  welcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  welcomeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  partnerSection: {
    marginBottom: 16,
  },
  partnerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  taskCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});
