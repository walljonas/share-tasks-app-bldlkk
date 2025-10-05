
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';
import { Task } from '@/types/Task';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onPress: () => void;
  onShare?: () => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
}

export default function TaskCard({ 
  task, 
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

  const completedSubTasks = task.subTasks.filter(st => st.completed).length;
  const totalSubTasks = task.subTasks.length;
  const progressPercentage = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

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

                {task.sharedWith.length > 0 && (
                  <View style={styles.sharedIndicator}>
                    <IconSymbol name="person.2.fill" size={12} color={theme.colors.primary} />
                    <Text style={[styles.sharedText, { color: theme.colors.primary }]}>
                      Shared
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
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sharedText: {
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
