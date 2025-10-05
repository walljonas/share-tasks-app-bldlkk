
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Platform,
  Modal,
  RefreshControl,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/TaskCard";
import CreateTaskModal from "@/components/CreateTaskModal";
import InvitePartnerModal from "@/components/InvitePartnerModal";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const theme = useTheme();
  const {
    tasks,
    partners,
    loading,
    createTask,
    updateTask,
    invitePartner,
    shareTaskWithPartner,
  } = useTasks();

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showInvitePartner, setShowInvitePartner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleInvitePartner = async (email: string, name: string) => {
    await invitePartner(email, name);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const acceptedPartners = partners.filter(p => p.status === 'accepted');

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      <Pressable
        onPress={() => setShowInvitePartner(true)}
        style={styles.headerButton}
      >
        <IconSymbol name="person.badge.plus" color={theme.colors.primary} size={20} />
      </Pressable>
      <Pressable
        onPress={() => setShowCreateTask(true)}
        style={styles.headerButton}
      >
        <IconSymbol name="plus" color={theme.colors.primary} size={20} />
      </Pressable>
    </View>
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
          {pendingTasks.length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Active Tasks
        </Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: '#34C759' }]}>
          {completedTasks.length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Completed
        </Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: '#FF9500' }]}>
          {acceptedPartners.length}
        </Text>
        <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
          Partners
        </Text>
      </View>
    </GlassView>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Loop Tasks",
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
                Loop Tasks
              </Text>
              {renderHeaderRight()}
            </View>
          )}

          {/* Stats */}
          {renderStats()}

          {/* Welcome message for new users */}
          {tasks.length === 0 && (
            <GlassView
              style={[
                styles.welcomeContainer,
                Platform.OS !== 'ios' && {
                  backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              glassEffectStyle="regular"
            >
              <IconSymbol name="list.bullet.clipboard" size={48} color={theme.colors.primary} />
              <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
                Welcome to Loop Tasks
              </Text>
              <Text style={[styles.welcomeText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Create your first task or invite partners to start collaborating on shared projects.
              </Text>
              <View style={styles.welcomeButtons}>
                <Pressable
                  onPress={() => setShowCreateTask(true)}
                  style={[styles.welcomeButton, { backgroundColor: theme.colors.primary }]}
                >
                  <IconSymbol name="plus" size={16} color="white" />
                  <Text style={styles.welcomeButtonText}>Create Task</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowInvitePartner(true)}
                  style={[styles.welcomeButton, styles.welcomeButtonSecondary, { borderColor: theme.colors.primary }]}
                >
                  <IconSymbol name="person.badge.plus" size={16} color={theme.colors.primary} />
                  <Text style={[styles.welcomeButtonText, { color: theme.colors.primary }]}>
                    Invite Partner
                  </Text>
                </Pressable>
              </View>
            </GlassView>
          )}

          {/* Active Tasks */}
          {pendingTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Active Tasks ({pendingTasks.length})
              </Text>
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onPress={() => console.log('Task pressed:', task.id)}
                  onShare={() => console.log('Share task:', task.id)}
                />
              ))}
            </View>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Completed ({completedTasks.length})
              </Text>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onPress={() => console.log('Task pressed:', task.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Create Task Modal */}
        <Modal
          visible={showCreateTask}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <CreateTaskModal
            onClose={() => setShowCreateTask(false)}
            onCreateTask={handleCreateTask}
            partners={partners}
          />
        </Modal>

        {/* Invite Partner Modal */}
        <Modal
          visible={showInvitePartner}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <InvitePartnerModal
            onClose={() => setShowInvitePartner(false)}
            onInvite={handleInvitePartner}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
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
  welcomeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  welcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  welcomeButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
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
});
