
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useTasks } from '@/hooks/useTasks';
import { Stack } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import CreateTaskForPartnerModal from '@/components/CreateTaskForPartnerModal';
import InvitePartnerModal from '@/components/InvitePartnerModal';
import PartnerCard from '@/components/PartnerCard';
import TaskCard from '@/components/TaskCard';
import { useTheme } from '@react-navigation/native';
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

export default function PartnersScreen() {
  const theme = useTheme();
  const { 
    tasks,
    partners, 
    loading,
    invitePartner,
    updatePartnerStatus,
    createTaskForPartner,
    updateTask,
    updateSubTask,
  } = useTasks();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleInvitePartner = async (email: string, name: string) => {
    await invitePartner(email, name);
    setShowInviteModal(false);
  };

  const handleAcceptPartner = async (partnerId: string) => {
    await updatePartnerStatus(partnerId, 'accepted');
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
          onPress: () => updatePartnerStatus(partnerId, 'declined')
        },
      ]
    );
  };

  const handleCreateTaskForPartner = async (taskData: any) => {
    if (selectedPartnerId) {
      await createTaskForPartner(selectedPartnerId, taskData);
      setShowCreateTaskModal(false);
      setSelectedPartnerId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTasksForPartner = (partnerId: string) => {
    return tasks.filter(task => 
      task.assignedTo === partnerId || 
      task.sharedWith.includes(partnerId)
    );
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  const handleToggleSubTask = async (taskId: string, subTaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const subTask = task.subTasks.find(st => st.id === subTaskId);
      if (subTask) {
        await updateSubTask(taskId, subTaskId, { completed: !subTask.completed });
      }
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowInviteModal(true);
      }}
      style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
    >
      <IconSymbol name="person.badge.plus" size={16} color="white" />
    </Pressable>
  );

  const renderStats = () => {
    const acceptedPartners = partners.filter(p => p.status === 'accepted').length;
    const pendingPartners = partners.filter(p => p.status === 'pending').length;
    const sharedTasks = tasks.filter(task => task.sharedWith.length > 0).length;
    const assignedTasks = tasks.filter(task => task.assignedTo).length;

    return (
      <View style={styles.statsContainer}>
        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {acceptedPartners}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Active Partners
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#FF9500' }]}>
            {pendingPartners}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Pending
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#34C759' }]}>
            {sharedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Shared Tasks
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#FF3B30' }]}>
            {assignedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Assigned Tasks
          </Text>
        </GlassView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: "Partners",
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderStats()}

        {/* Partners Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Partners
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Loading partners...
              </Text>
            </View>
          ) : partners.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="person.2" size={48} color={theme.colors.text} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No partners yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
                Invite partners to collaborate on tasks
              </Text>
            </View>
          ) : (
            partners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onAccept={partner.status === 'pending' ? () => handleAcceptPartner(partner.id) : undefined}
                onDecline={partner.status === 'pending' ? () => handleDeclinePartner(partner.id) : undefined}
                onPress={partner.status === 'accepted' ? () => {
                  setSelectedPartnerId(partner.id);
                  setShowCreateTaskModal(true);
                } : undefined}
              />
            ))
          )}
        </View>

        {/* Partner Tasks Section */}
        {partners.filter(p => p.status === 'accepted').map((partner) => {
          const partnerTasks = getTasksForPartner(partner.id);
          
          if (partnerTasks.length === 0) return null;

          return (
            <View key={`tasks-${partner.id}`} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Tasks with {partner.name}
              </Text>
              
              {partnerTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  partners={partners}
                  onToggleComplete={handleToggleTask}
                  onToggleSubTask={handleToggleSubTask}
                  onPress={() => {
                    console.log('Task pressed:', task.title);
                    // TODO: Navigate to task detail
                  }}
                  onShare={() => {
                    console.log('Share task:', task.title);
                    // TODO: Implement share functionality
                  }}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

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

      <Modal
        visible={showCreateTaskModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateTaskForPartnerModal
          onClose={() => {
            setShowCreateTaskModal(false);
            setSelectedPartnerId(null);
          }}
          onCreateTask={handleCreateTaskForPartner}
          partnerId={selectedPartnerId}
          partnerName={partners.find(p => p.id === selectedPartnerId)?.name || ''}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for floating tab bar
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? undefined : 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
