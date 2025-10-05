
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Quest, Ally } from '@/types/Quest';
import { GlassView } from 'expo-glass-effect';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

interface QuestCardProps {
  quest: Quest;
  allies: Ally[];
  onToggleComplete: (questId: string) => void;
  onPress: () => void;
  onShare?: () => void;
  onToggleSubQuest?: (questId: string, subQuestId: string) => void;
}

export default function QuestCard({ 
  quest, 
  allies,
  onToggleComplete, 
  onPress, 
  onShare,
  onToggleSubQuest 
}: QuestCardProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const handleToggleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete(quest.id);
  };

  const handleToggleSubQuest = (subQuestId: string) => {
    if (onToggleSubQuest) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggleSubQuest(quest.id, subQuestId);
    }
  };

  const getDifficultyConfig = () => {
    switch (quest.difficulty) {
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

  const getCategoryConfig = () => {
    switch (quest.category) {
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getAlliedPartners = () => {
    return allies.filter(ally => 
      quest.sharedWith.includes(ally.id) && ally.status === 'allied'
    );
  };

  const getAssignedAlly = () => {
    if (!quest.assignedTo) return null;
    return allies.find(ally => ally.id === quest.assignedTo);
  };

  const completedSubQuests = quest.subQuests.filter(sq => sq.completed).length;
  const totalSubQuests = quest.subQuests.length;
  const progressPercentage = totalSubQuests > 0 ? (completedSubQuests / totalSubQuests) * 100 : 0;

  const alliedPartners = getAlliedPartners();
  const assignedAlly = getAssignedAlly();
  const difficultyConfig = getDifficultyConfig();
  const categoryConfig = getCategoryConfig();

  return (
    <View style={styles.container}>
      <GlassView
        style={[
          styles.questCard,
          {
            borderLeftColor: difficultyConfig.color,
          },
          colorScheme !== 'ios' && {
            backgroundColor: colors.surface,
          },
        ]}
        glassEffectStyle="regular"
      >
        <Pressable onPress={onPress} style={styles.content}>
          {/* Header with completion status and category */}
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <Pressable onPress={handleToggleComplete} style={styles.completionButton}>
                <View style={[
                  styles.hexagon,
                  { 
                    backgroundColor: quest.completed ? colors.success : 'transparent',
                    borderWidth: quest.completed ? 0 : 2,
                    borderColor: quest.completed ? 'transparent' : colors.border,
                  }
                ]}>
                  <View style={styles.hexagonInner}>
                    <IconSymbol
                      name={quest.completed ? 'checkmark' : 'circle'}
                      size={20}
                      color={quest.completed ? 'white' : colors.text}
                    />
                  </View>
                </View>
              </Pressable>

              <View style={styles.questInfo}>
                <View style={styles.questMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color }]}>
                    <Text style={styles.categoryEmoji}>{categoryConfig.emoji}</Text>
                    <Text style={styles.categoryText}>{quest.category.toUpperCase()}</Text>
                  </View>
                  
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyConfig.color }]}>
                    <IconSymbol name={difficultyConfig.icon} size={12} color="white" />
                    <Text style={styles.difficultyText}>{difficultyConfig.label}</Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.title,
                    {
                      color: quest.completed ? colors.textSecondary : colors.text,
                      textDecorationLine: quest.completed ? 'line-through' : 'none',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {quest.title}
                </Text>

                {quest.description && (
                  <Text
                    style={[styles.description, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {quest.description}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.rightHeader}>
              <View style={styles.xpContainer}>
                <IconSymbol name="star.fill" size={16} color={colors.warning} />
                <Text style={[styles.xpText, { color: colors.warning }]}>
                  {quest.xpReward} XP
                </Text>
              </View>
              
              {onShare && (
                <Pressable onPress={onShare} style={styles.shareButton}>
                  <IconSymbol name="square.and.arrow.up" size={18} color={colors.primary} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Assigned Ally */}
          {assignedAlly && (
            <View style={styles.assignedContainer}>
              <IconSymbol name="person.fill" size={14} color={colors.warning} />
              <Text style={[styles.assignedText, { color: colors.warning }]}>
                Assigned to {assignedAlly.name} (Lvl {assignedAlly.level})
              </Text>
            </View>
          )}

          {/* Allied Partners */}
          {alliedPartners.length > 0 && (
            <View style={styles.alliesContainer}>
              <View style={styles.alliesHeader}>
                <IconSymbol name="person.2.fill" size={14} color={colors.primary} />
                <Text style={[styles.alliesHeaderText, { color: colors.primary }]}>
                  Quest Allies:
                </Text>
              </View>
              <View style={styles.alliesList}>
                {alliedPartners.slice(0, 3).map((ally) => (
                  <View key={ally.id} style={styles.allyItem}>
                    <View style={[styles.allyAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.allyInitial}>
                        {ally.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.allyInfo}>
                      <Text style={[styles.allyName, { color: colors.text }]} numberOfLines={1}>
                        {ally.name}
                      </Text>
                      <Text style={[styles.allyLevel, { color: colors.textSecondary }]}>
                        Lvl {ally.level}
                      </Text>
                    </View>
                  </View>
                ))}
                {alliedPartners.length > 3 && (
                  <View style={styles.moreAlliesContainer}>
                    <View style={[styles.moreAlliesCircle, { backgroundColor: colors.backgroundAlt }]}>
                      <Text style={[styles.moreAlliesText, { color: colors.text }]}>
                        +{alliedPartners.length - 3}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Progress bar for multi-step quests */}
          {quest.isMultiStep && totalSubQuests > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.text }]}>
                  Quest Progress
                </Text>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {completedSubQuests}/{totalSubQuests} steps
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.backgroundAlt }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: progressPercentage === 100 ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
                {Math.round(progressPercentage)}% Complete
              </Text>
            </View>
          )}

          {/* Sub-quests preview */}
          {quest.isMultiStep && quest.subQuests.length > 0 && (
            <View style={styles.subQuestsContainer}>
              <Text style={[styles.subQuestsTitle, { color: colors.text }]}>
                Quest Steps:
              </Text>
              {quest.subQuests.slice(0, 3).map((subQuest) => (
                <Pressable
                  key={subQuest.id}
                  onPress={() => handleToggleSubQuest(subQuest.id)}
                  style={styles.subQuestItem}
                >
                  <IconSymbol
                    name={subQuest.completed ? 'checkmark.circle.fill' : 'circle'}
                    size={18}
                    color={subQuest.completed ? colors.success : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.subQuestTitle,
                      {
                        color: subQuest.completed ? colors.textSecondary : colors.text,
                        textDecorationLine: subQuest.completed ? 'line-through' : 'none',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {subQuest.title}
                  </Text>
                  <View style={styles.subQuestXp}>
                    <IconSymbol name="star.fill" size={12} color={colors.warning} />
                    <Text style={[styles.subQuestXpText, { color: colors.warning }]}>
                      {subQuest.xpReward}
                    </Text>
                  </View>
                </Pressable>
              ))}
              
              {quest.subQuests.length > 3 && (
                <Text style={[styles.moreSubQuests, { color: colors.textSecondary }]}>
                  +{quest.subQuests.length - 3} more steps...
                </Text>
              )}
            </View>
          )}

          {/* Footer with due date */}
          {quest.dueDate && (
            <View style={styles.footer}>
              <IconSymbol name="clock" size={14} color={colors.textSecondary} />
              <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
                Due {formatDate(quest.dueDate)}
              </Text>
            </View>
          )}
        </Pressable>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  questCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderLeftWidth: 6,
    backgroundColor: colors.surface,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  rightHeader: {
    alignItems: 'flex-end',
    gap: 8,
  },
  completionButton: {
    marginRight: 16,
    marginTop: 4,
  },
  hexagon: {
    width: 40,
    height: 40,
    transform: [{ rotate: '45deg' }],
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonInner: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  questInfo: {
    flex: 1,
  },
  questMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
  },
  shareButton: {
    padding: 4,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alliesContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  alliesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  alliesHeaderText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alliesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.glass,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 120,
  },
  allyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allyInitial: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  allyInfo: {
    flex: 1,
  },
  allyName: {
    fontSize: 11,
    fontWeight: '600',
  },
  allyLevel: {
    fontSize: 9,
    fontWeight: '500',
  },
  moreAlliesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreAlliesCircle: {
    width: 32,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreAlliesText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  subQuestsContainer: {
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subQuestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  subQuestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  subQuestTitle: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
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
  moreSubQuests: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
});
