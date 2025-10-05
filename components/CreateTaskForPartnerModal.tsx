
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  useColorScheme,
  Switch,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { Task, SubTask } from '@/types/Task';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreateTaskForPartnerModalProps {
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedTo'>) => void;
  partnerId: string | null;
  partnerName: string;
}

export default function CreateTaskForPartnerModal({ 
  onClose, 
  onCreateTask, 
  partnerId, 
  partnerName 
}: CreateTaskForPartnerModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isChecklist, setIsChecklist] = useState(false);
  const [subTasks, setSubTasks] = useState<Omit<SubTask, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!partnerId) {
      Alert.alert('Error', 'No partner selected');
      return;
    }

    const finalSubTasks: SubTask[] = subTasks.map((subTask, index) => ({
      ...subTask,
      id: `${Date.now()}-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedTo'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      createdBy: 'current-user',
      tags: [],
      collaborators: [partnerId],
      sharedWith: [partnerId],
      subTasks: finalSubTasks,
      isChecklist,
    };

    onCreateTask(newTask);
    onClose();
  };

  const addSubTask = () => {
    if (!newSubTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a sub-task title');
      return;
    }

    const newSubTask: Omit<SubTask, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newSubTaskTitle.trim(),
      completed: false,
    };

    setSubTasks([...subTasks, newSubTask]);
    setNewSubTaskTitle('');
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const updateSubTask = (index: number, title: string) => {
    const updatedSubTasks = subTasks.map((subTask, i) =>
      i === index ? { ...subTask, title } : subTask
    );
    setSubTasks(updatedSubTasks);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create Task for {partnerName}
        </Text>
        <Pressable onPress={handleCreate} style={styles.createButton}>
          <Text style={[styles.createButtonText, { color: theme.colors.primary }]}>Create</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Task Details</Text>
          
          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.text,
                borderColor: theme.dark ? '#333' : '#ddd',
              },
            ]}
            placeholder="Task title"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={title}
            onChangeText={setTitle}
            multiline
          />
          
          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              {
                color: theme.colors.text,
                borderColor: theme.dark ? '#333' : '#ddd',
              },
            ]}
            placeholder="Description (optional)"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </GlassView>

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
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Priority</Text>
          
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityButton,
                  {
                    backgroundColor: priority === p ? getPriorityColor(p) : 'transparent',
                    borderColor: getPriorityColor(p),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: priority === p ? 'white' : getPriorityColor(p),
                    },
                  ]}
                >
                  {p.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </GlassView>

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
          <View style={styles.checklistHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Checklist Mode
            </Text>
            <Switch
              value={isChecklist}
              onValueChange={setIsChecklist}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={isChecklist ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          
          <Text style={[styles.checklistDescription, { color: theme.dark ? '#98989D' : '#666' }]}>
            Enable checklist mode to break down this task into smaller sub-tasks
          </Text>

          {isChecklist && (
            <>
              <View style={styles.addSubTaskContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.subTaskInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.dark ? '#333' : '#ddd',
                    },
                  ]}
                  placeholder="Add sub-task"
                  placeholderTextColor={theme.dark ? '#666' : '#999'}
                  value={newSubTaskTitle}
                  onChangeText={setNewSubTaskTitle}
                  onSubmitEditing={addSubTask}
                />
                <Pressable
                  onPress={addSubTask}
                  style={[styles.addSubTaskButton, { backgroundColor: theme.colors.primary }]}
                >
                  <IconSymbol name="plus" size={16} color="white" />
                </Pressable>
              </View>

              {subTasks.map((subTask, index) => (
                <View key={index} style={styles.subTaskItem}>
                  <IconSymbol name="circle" size={16} color={theme.colors.text} />
                  <TextInput
                    style={[
                      styles.subTaskTitle,
                      { color: theme.colors.text, flex: 1 },
                    ]}
                    value={subTask.title}
                    onChangeText={(text) => updateSubTask(index, text)}
                    placeholder="Sub-task title"
                    placeholderTextColor={theme.dark ? '#666' : '#999'}
                  />
                  <Pressable
                    onPress={() => removeSubTask(index)}
                    style={styles.removeSubTaskButton}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color="#FF3B30" />
                  </Pressable>
                </View>
              ))}

              {subTasks.length > 0 && (
                <Text style={[styles.subTaskCount, { color: theme.dark ? '#98989D' : '#666' }]}>
                  {subTasks.length} sub-task{subTasks.length !== 1 ? 's' : ''} added
                </Text>
              )}
            </>
          )}
        </GlassView>
      </ScrollView>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  createButton: {
    padding: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checklistDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  addSubTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subTaskInput: {
    flex: 1,
    marginBottom: 0,
  },
  addSubTaskButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  subTaskTitle: {
    fontSize: 16,
    paddingVertical: 4,
  },
  removeSubTaskButton: {
    padding: 4,
  },
  subTaskCount: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
