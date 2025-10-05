
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
import { Quest, Ally, SubQuest } from '@/types/Quest';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

interface CreateQuestModalProps {
  onClose: () => void;
  onCreateQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  allies: Ally[];
}

export default function CreateQuestModal({ onClose, onCreateQuest, allies }: CreateQuestModalProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'legendary'>('medium');
  const [category, setCategory] = useState<'personal' | 'work' | 'health' | 'learning' | 'social' | 'creative'>('personal');
  const [selectedAllies, setSelectedAllies] = useState<string[]>([]);
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [subQuests, setSubQuests] = useState<Omit<SubQuest, 'id' | 'createdAt' | 'updatedAt'>[]>([]);
  const [newSubQuestTitle, setNewSubQuestTitle] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Quest Incomplete!', 'Please enter a quest title to begin your adventure');
      return;
    }

    const baseXp = getDifficultyXp(difficulty);
    const subQuestXp = subQuests.reduce((total, sq) => total + sq.xpReward, 0);
    const totalXp = baseXp + subQuestXp;

    const finalSubQuests: SubQuest[] = subQuests.map((subQuest, index) => ({
      ...subQuest,
      id: `${Date.now()}-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const newQuest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      difficulty,
      category,
      createdBy: 'current-user',
      tags: [],
      allies: selectedAllies,
      sharedWith: selectedAllies,
      subQuests: finalSubQuests,
      isMultiStep,
      xpReward: totalXp,
      status: 'active',
    };

    onCreateQuest(newQuest);
    onClose();
  };

  const getDifficultyXp = (diff: string) => {
    switch (diff) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      case 'legendary': return 100;
      default: return 25;
    }
  };

  const getSubQuestXp = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 5;
      case 'medium': return 10;
      case 'hard': return 20;
      case 'legendary': return 30;
      default: return 10;
    }
  };

  const toggleAlly = (allyId: string) => {
    setSelectedAllies(prev =>
      prev.includes(allyId)
        ? prev.filter(id => id !== allyId)
        : [...prev, allyId]
    );
  };

  const addSubQuest = () => {
    if (!newSubQuestTitle.trim()) {
      Alert.alert('Step Missing!', 'Please enter a quest step title');
      return;
    }

    const newSubQuest: Omit<SubQuest, 'id' | 'createdAt' | 'updatedAt'> = {
      title: newSubQuestTitle.trim(),
      completed: false,
      xpReward: getSubQuestXp(difficulty),
    };

    setSubQuests([...subQuests, newSubQuest]);
    setNewSubQuestTitle('');
  };

  const removeSubQuest = (index: number) => {
    setSubQuests(subQuests.filter((_, i) => i !== index));
  };

  const updateSubQuest = (index: number, title: string) => {
    const updatedSubQuests = subQuests.map((subQuest, i) =>
      i === index ? { ...subQuest, title } : subQuest
    );
    setSubQuests(updatedSubQuests);
  };

  const getDifficultyConfig = (diff: string) => {
    switch (diff) {
      case 'legendary':
        return { color: '#F59E0B', icon: 'crown.fill', label: 'LEGENDARY' };
      case 'hard':
        return { color: '#EF4444', icon: 'flame.fill', label: 'HARD' };
      case 'medium':
        return { color: '#8B5CF6', icon: 'bolt.fill', label: 'MEDIUM' };
      case 'easy':
        return { color: '#10B981', icon: 'leaf.fill', label: 'EASY' };
      default:
        return { color: colors.primary, icon: 'circle.fill', label: 'UNKNOWN' };
    }
  };

  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case 'work':
        return { color: '#3B82F6', icon: 'briefcase.fill', emoji: '💼' };
      case 'health':
        return { color: '#10B981', icon: 'heart.fill', emoji: '❤️' };
      case 'learning':
        return { color: '#8B5CF6', icon: 'book.fill', emoji: '📚' };
      case 'social':
        return { color: '#F59E0B', icon: 'person.2.fill', emoji: '👥' };
      case 'creative':
        return { color: '#EC4899', icon: 'paintbrush.fill', emoji: '🎨' };
      default:
        return { color: '#6B7280', icon: 'star.fill', emoji: '⭐' };
    }
  };

  const alliedPartners = allies.filter(a => a.status === 'allied');
  const totalXp = getDifficultyXp(difficulty) + subQuests.reduce((total, sq) => total + sq.xpReward, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Create New Quest</Text>
        <Pressable onPress={handleCreate} style={[styles.createButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.createButtonText}>Start Quest</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quest Details */}
        <GlassView
          style={[
            styles.section,
            colorScheme !== 'ios' && { backgroundColor: colors.surface },
          ]}
          glassEffectStyle="regular"
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quest Details</Text>
          
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="What's your quest?"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            multiline
          />
          
          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Describe your adventure (optional)"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.xpPreview}>
            <IconSymbol name="star.fill" size={20} color={colors.warning} />
            <Text style={[styles.xpPreviewText, { color: colors.warning }]}>
              Total Reward: {totalXp} XP
            </Text>
          </View>
        </GlassView>

        {/* Category Selection */}
        <GlassView
          style={[
            styles.section,
            colorScheme !== 'ios' && { backgroundColor: colors.surface },
          ]}
          glassEffectStyle="regular"
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quest Category</Text>
          
          <View style={styles.categoryGrid}>
            {(['personal', 'work', 'health', 'learning', 'social', 'creative'] as const).map((cat) => {
              const config = getCategoryConfig(cat);
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: category === cat ? config.color : 'transparent',
                      borderColor: config.color,
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{config.emoji}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      { color: category === cat ? 'white' : config.color },
                    ]}
                  >
                    {cat.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassView>

        {/* Difficulty Selection */}
        <GlassView
          style={[
            styles.section,
            colorScheme !== 'ios' && { backgroundColor: colors.surface },
          ]}
          glassEffectStyle="regular"
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty Level</Text>
          
          <View style={styles.difficultyContainer}>
            {(['easy', 'medium', 'hard', 'legendary'] as const).map((diff) => {
              const config = getDifficultyConfig(diff);
              return (
                <Pressable
                  key={diff}
                  onPress={() => setDifficulty(diff)}
                  style={[
                    styles.difficultyButton,
                    {
                      backgroundColor: difficulty === diff ? config.color : 'transparent',
                      borderColor: config.color,
                    },
                  ]}
                >
                  <IconSymbol 
                    name={config.icon} 
                    size={16} 
                    color={difficulty === diff ? 'white' : config.color} 
                  />
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: difficulty === diff ? 'white' : config.color },
                    ]}
                  >
                    {config.label}
                  </Text>
                  <Text
                    style={[
                      styles.difficultyXp,
                      { color: difficulty === diff ? 'white' : config.color },
                    ]}
                  >
                    {getDifficultyXp(diff)} XP
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassView>

        {/* Multi-Step Quest */}
        <GlassView
          style={[
            styles.section,
            colorScheme !== 'ios' && { backgroundColor: colors.surface },
          ]}
          glassEffectStyle="regular"
        >
          <View style={styles.multiStepHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Multi-Step Quest
              </Text>
              <Text style={[styles.multiStepDescription, { color: colors.textSecondary }]}>
                Break your quest into smaller, manageable steps
              </Text>
            </View>
            <Switch
              value={isMultiStep}
              onValueChange={setIsMultiStep}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isMultiStep ? 'white' : colors.textSecondary}
            />
          </View>

          {isMultiStep && (
            <>
              <View style={styles.addSubQuestContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.subQuestInput,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  placeholder="Add quest step"
                  placeholderTextColor={colors.textSecondary}
                  value={newSubQuestTitle}
                  onChangeText={setNewSubQuestTitle}
                  onSubmitEditing={addSubQuest}
                />
                <Pressable
                  onPress={addSubQuest}
                  style={[styles.addSubQuestButton, { backgroundColor: colors.primary }]}
                >
                  <IconSymbol name="plus" size={16} color="white" />
                </Pressable>
              </View>

              {subQuests.map((subQuest, index) => (
                <View key={index} style={styles.subQuestItem}>
                  <IconSymbol name="circle" size={16} color={colors.textSecondary} />
                  <TextInput
                    style={[
                      styles.subQuestTitle,
                      { color: colors.text, flex: 1 },
                    ]}
                    value={subQuest.title}
                    onChangeText={(text) => updateSubQuest(index, text)}
                    placeholder="Quest step title"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <View style={styles.subQuestXp}>
                    <IconSymbol name="star.fill" size={12} color={colors.warning} />
                    <Text style={[styles.subQuestXpText, { color: colors.warning }]}>
                      {subQuest.xpReward}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeSubQuest(index)}
                    style={styles.removeSubQuestButton}
                  >
                    <IconSymbol name="xmark.circle.fill" size={20} color={colors.danger} />
                  </Pressable>
                </View>
              ))}

              {subQuests.length > 0 && (
                <Text style={[styles.subQuestCount, { color: colors.textSecondary }]}>
                  {subQuests.length} quest step{subQuests.length !== 1 ? 's' : ''} added
                </Text>
              )}
            </>
          )}
        </GlassView>

        {/* Allies Selection */}
        {alliedPartners.length > 0 && (
          <GlassView
            style={[
              styles.section,
              colorScheme !== 'ios' && { backgroundColor: colors.surface },
            ]}
            glassEffectStyle="regular"
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Invite Quest Allies
            </Text>
            
            {alliedPartners.map((ally) => (
              <Pressable
                key={ally.id}
                onPress={() => toggleAlly(ally.id)}
                style={styles.allyItem}
              >
                <View style={styles.allyInfo}>
                  <View style={[styles.allyAvatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.allyInitial}>
                      {ally.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.allyDetails}>
                    <Text style={[styles.allyName, { color: colors.text }]}>
                      {ally.name}
                    </Text>
                    <Text style={[styles.allyStats, { color: colors.textSecondary }]}>
                      Level {ally.level} • {ally.questsCompleted} quests completed
                    </Text>
                  </View>
                </View>
                
                <IconSymbol
                  name={selectedAllies.includes(ally.id) ? 'checkmark.circle.fill' : 'circle'}
                  size={24}
                  color={selectedAllies.includes(ally.id) ? colors.success : colors.textSecondary}
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
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: colors.backgroundAlt,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  xpPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  xpPreviewText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  difficultyContainer: {
    gap: 8,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginLeft: 12,
  },
  difficultyXp: {
    fontSize: 12,
    fontWeight: '600',
  },
  multiStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  multiStepDescription: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  addSubQuestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subQuestInput: {
    flex: 1,
    marginBottom: 0,
  },
  addSubQuestButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subQuestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.backgroundAlt,
  },
  subQuestTitle: {
    fontSize: 14,
    paddingVertical: 4,
  },
  subQuestXp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  subQuestXpText: {
    fontSize: 10,
    fontWeight: '600',
  },
  removeSubQuestButton: {
    padding: 4,
  },
  subQuestCount: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  allyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.backgroundAlt,
  },
  allyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  allyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allyInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  allyDetails: {
    marginLeft: 12,
    flex: 1,
  },
  allyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  allyStats: {
    fontSize: 12,
    marginTop: 2,
  },
});
