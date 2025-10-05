
import { GlassView } from "expo-glass-effect";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import InvitePartnerModal from "@/components/InvitePartnerModal";
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
import CreateTaskModal from "@/components/CreateTaskModal";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import TaskCard from "@/components/TaskCard";

export default function HomeScreen() {
  const theme = useTheme();
  const { 
    tasks, 
    partners,
    loading, 
    createTask, 
    updateTask, 
    updateSubTask,
    invitePartner 
  } = useTasks();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    setShowCreateModal(false);
  };

  const handleInvitePartner = async (email: string, name: string) => {
    await invitePartner(email, name);
    setShowInviteModal(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowInviteModal(true);
        }}
        style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
      >
        <IconSymbol name="person.badge.plus" size={16} color="white" />
      </Pressable>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowCreateModal(true);
        }}
        style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
      >
        <IconSymbol name="plus" size={16} color="white" />
      </Pressable>
    </View>
  );

  const renderStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const pendingTasks = totalTasks - completedTasks;
    const sharedTasks = tasks.filter(task => task.sharedWith.length > 0).length;
    const assignedTasks = tasks.filter(task => task.assignedTo).length;

    return (
      <View style={styles.statsContainer}>
        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {totalTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Total Tasks
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#34C759' }]}>
            {completedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Completed
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#FF9500' }]}>
            {pendingTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Pending
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {sharedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Shared
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <Text style={[styles.statNumber, { color: '#FF3B30' }]}>
            {assignedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Assigned
          </Text>
        </GlassView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: "Tasks",
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

        <View style={styles.tasksSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Tasks
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Loading tasks...
              </Text>
            </View>
          ) : tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="checkmark.circle" size={48} color={theme.colors.text} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No tasks yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
                Create your first task to get started
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
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
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreateTask={handleCreateTask}
          partners={partners.filter(p => p.status === 'accepted')}
        />
      </Modal>

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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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
  tasksSection: {
    flex: 1,
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
