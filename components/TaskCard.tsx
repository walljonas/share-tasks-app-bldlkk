
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Task } from '@/types/Task';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onPress: () => void;
  onShare?: () => void;
}

export default function TaskCard({ task, onToggleComplete, onPress, onShare }: TaskCardProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleComplete(task.id);
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

  return (
    <GlassView
      style={[
        styles.container,
        task.completed && styles.completedContainer,
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
          <Pressable onPress={handleToggleComplete} style={styles.checkbox}>
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
                { color: theme.colors.text },
                task.completed && styles.completedText,
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
                  task.completed && styles.completedText,
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}
            
            <View style={styles.metadata}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
              </View>
              
              {task.dueDate && (
                <Text style={[styles.dueDate, { color: theme.dark ? '#98989D' : '#666' }]}>
                  Due {formatDate(task.dueDate)}
                </Text>
              )}
              
              {task.sharedWith.length > 0 && (
                <View style={styles.sharedIndicator}>
                  <IconSymbol name="person.2.fill" size={12} color={theme.colors.primary} />
                  <Text style={[styles.sharedText, { color: theme.colors.primary }]}>
                    {task.sharedWith.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {onShare && (
            <Pressable onPress={onShare} style={styles.shareButton}>
              <IconSymbol name="square.and.arrow.up" size={20} color={theme.colors.primary} />
            </Pressable>
          )}
        </View>
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
  completedContainer: {
    opacity: 0.7,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
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
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sharedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  shareButton: {
    padding: 4,
    marginLeft: 8,
  },
});
