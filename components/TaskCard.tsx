
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Task, Partner } from '@/types/Task';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';

interface TaskCardProps {
  task: Task;
  partners: Partner[];
  onToggleComplete: (taskId: string) => void;
  onPress: () => void;
  onShare?: () => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
}

export default function TaskCard({ 
  task, 
  partners,
  onToggleComplete, 
  onPress, 
  onShare,
  onToggleSubTask 
}: TaskCardProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleComplete(task.id);
  };

  const handleToggleSubTask = (subTaskId: string) => {
    if (onToggleSubTask) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggleSubTask(task.id, subTaskId);
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return theme.colors.text;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSharedPartners = () => {
    return partners.filter(partner => 
      task.sharedWith.includes(partner.id) && partner.status === 'accepted'
    );
  };

  const getAssignedPartner = () => {
    if (!task.assignedTo) return null;
    return partners.find(partner => partner.id === task.assignedTo);
  };

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;
  const progressPercentage = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const sharedPartners = getSharedPartners();
  const assignedPartner = getAssignedPartner();

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
        <View style={styles.header}>
          <Pressable onPress={handleToggleComplete} style={styles.checkboxContainer}>
            <IconSymbol
              name={task.completed ? 'checkmark.circle.fill' : 'circle'}
              size={24}
              color={task.completed ? '#34C759' : theme.colors.text}
            />
          </Pressable>

          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.title,
                {
                  color: task.completed ? theme.dark ? '#666' : '#999' : theme.colors.text,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            {task.description && (
              <Text
                style={[
                  styles.description,
                  { color: theme.dark ? '#98989D' : '#666' },
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}

            {/* Show assigned partner */}
            {assignedPartner && (
              <View style={styles.assignedContainer}>
                <IconSymbol name="person.fill" size={12} color="#FF9500" />
                <Text style={[styles.assignedText, { color: '#FF9500' }]}>
                  Assigned to {assignedPartner.name}
                </Text>
              </View>
            )}

            {/* Show shared partners */}
            {sharedPartners.length > 0 && (
              <View style={styles.sharedPartnersContainer}>
                <View style={styles.sharedHeader}>
                  <IconSymbol name="person.2.fill" size={12} color={theme.colors.primary} />
                  <Text style={[styles.sharedHeaderText, { color: theme.colors.primary }]}>
                    Shared with:
                  </Text>
                </View>
                <View style={styles.partnersList}>
                  {sharedPartners.slice(0, 3).map((partner, index) => (
                    <View key={partner.id} style={styles.partnerItem}>
                      <View style={[styles.partnerAvatar, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.partnerInitial}>
                          {partner.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={[styles.partnerName, { color: theme.colors.text }]} numberOfLines={1}>
                        {partner.name}
                      </Text>
                    </View>
                  ))}
                  {sharedPartners.length > 3 && (
                    <View style={styles.morePartnersContainer}>
                      <View style={[styles.morePartnersCircle, { backgroundColor: theme.dark ? '#333' : '#E5E5E7' }]}>
                        <Text style={[styles.morePartnersText, { color: theme.colors.text }]}>
                          +{sharedPartners.length - 3}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.metadata}>
              <View style={styles.metadataLeft}>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor() },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {task.priority.toUpperCase()}
                  </Text>
                </View>

                {task.isChecklist && totalSubTasks > 0 && (
                  <View style={styles.progressContainer}>
                    <IconSymbol name="list.bullet" size={12} color={theme.colors.text} />
                    <Text style={[styles.progressText, { color: theme.colors.text }]}>
                      {completedSubTasks}/{totalSubTasks}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.metadataRight}>
                {task.dueDate && (
                  <Text style={[styles.dueDate, { color: theme.dark ? '#98989D' : '#666' }]}>
                    {formatDate(task.dueDate)}
                  </Text>
                )}
                
                {onShare && (
                  <Pressable onPress={onShare} style={styles.shareButton}>
                    <IconSymbol name="square.and.arrow.up" size={16} color={theme.colors.primary} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Progress bar for checklist tasks */}
        {task.isChecklist && totalSubTasks > 0 && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBackground, { backgroundColor: theme.dark ? '#333' : '#E5E5E7' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: progressPercentage === 100 ? '#34C759' : theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPercentage, { color: theme.dark ? '#98989D' : '#666' }]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        )}

        {/* Sub-tasks preview (show first 3) */}
        {task.isChecklist && task.subTasks.length > 0 && (
          <View style={styles.subTasksContainer}>
            {task.subTasks.slice(0, 3).map((subTask) => (
              <Pressable
                key={subTask.id}
                onPress={() => handleToggleSubTask(subTask.id)}
                style={styles.subTaskItem}
              >
                <IconSymbol
                  name={subTask.completed ? 'checkmark.circle.fill' : 'circle'}
                  size={16}
                  color={subTask.completed ? '#34C759' : theme.colors.text}
                />
                <Text
                  style={[
                    styles.subTaskTitle,
                    {
                      color: subTask.completed ? theme.dark ? '#666' : '#999' : theme.colors.text,
                      textDecorationLine: subTask.completed ? 'line-through' : 'none',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {subTask.title}
                </Text>
              </Pressable>
            ))}
            
            {task.subTasks.length > 3 && (
              <Text style={[styles.moreSubTasks, { color: theme.dark ? '#98989D' : '#666' }]}>
                +{task.subTasks.length - 3} more sub-tasks
              </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sharedPartnersContainer: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sharedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  sharedHeaderText: {
    fontSize: 12,
    fontWeight: '600',
  },
  partnersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 120,
  },
  partnerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  partnerName: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  morePartnersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePartnersCircle: {
    width: 28,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePartnersText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  metadataRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  shareButton: {
    padding: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  subTasksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  subTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  subTaskTitle: {
    fontSize: 14,
    flex: 1,
  },
  moreSubTasks: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
});
