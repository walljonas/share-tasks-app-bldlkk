
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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { Task, Partner } from '@/types/Task';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  partners: Partner[];
}

export default function CreateTaskModal({ onClose, onCreateTask, partners }: CreateTaskModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      createdBy: 'current-user', // In a real app, this would be the current user ID
      tags: [],
      collaborators: selectedPartners,
      sharedWith: selectedPartners,
    };

    onCreateTask(newTask);
    onClose();
  };

  const togglePartner = (partnerId: string) => {
    setSelectedPartners(prev =>
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
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

  const acceptedPartners = partners.filter(p => p.status === 'accepted');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text }]}>Create Task</Text>
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

        {acceptedPartners.length > 0 && (
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Share with Partners
            </Text>
            
            {acceptedPartners.map((partner) => (
              <Pressable
                key={partner.id}
                onPress={() => togglePartner(partner.id)}
                style={styles.partnerItem}
              >
                <View style={styles.partnerInfo}>
                  <IconSymbol name="person.circle.fill" size={32} color={theme.colors.primary} />
                  <View style={styles.partnerDetails}>
                    <Text style={[styles.partnerName, { color: theme.colors.text }]}>
                      {partner.name}
                    </Text>
                    <Text style={[styles.partnerEmail, { color: theme.dark ? '#98989D' : '#666' }]}>
                      {partner.email}
                    </Text>
                  </View>
                </View>
                
                <IconSymbol
                  name={selectedPartners.includes(partner.id) ? 'checkmark.circle.fill' : 'circle'}
                  size={24}
                  color={selectedPartners.includes(partner.id) ? '#34C759' : theme.colors.text}
                />
              </Pressable>
            ))}
          </GlassView>
        )}
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
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  partnerEmail: {
    fontSize: 14,
  },
});
