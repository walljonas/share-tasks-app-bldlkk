
import { GlassView } from "expo-glass-effect";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import InviteAllyModal from "@/components/InviteAllyModal";
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
import CreateQuestModal from "@/components/CreateQuestModal";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import QuestCard from "@/components/QuestCard";
import { colors } from "@/styles/commonStyles";

export default function QuestBoardScreen() {
  const theme = useTheme();
  const { 
    tasks: quests, 
    partners: allies,
    loading, 
    createTask: createQuest, 
    updateTask: updateQuest, 
    updateSubTask: updateSubQuest,
    invitePartner: inviteAlly 
  } = useTasks();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleQuest = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      await updateQuest(questId, { completed: !quest.completed });
    }
  };

  const handleToggleSubQuest = async (questId: string, subQuestId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      const subQuest = quest.subTasks.find(sq => sq.id === subQuestId);
      if (subQuest) {
        await updateSubQuest(questId, subQuestId, { completed: !subQuest.completed });
      }
    }
  };

  const handleCreateQuest = async (questData: any) => {
    await createQuest(questData);
    setShowCreateModal(false);
  };

  const handleInviteAlly = async (email: string, name: string) => {
    await inviteAlly(email, name);
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
        style={[styles.headerButton, { backgroundColor: colors.primary }]}
      >
        <IconSymbol name="person.badge.plus" size={16} color="white" />
      </Pressable>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowCreateModal(true);
        }}
        style={[styles.headerButton, { backgroundColor: colors.success }]}
      >
        <IconSymbol name="plus" size={16} color="white" />
      </Pressable>
    </View>
  );

  const renderStats = () => {
    const completedQuests = quests.filter(quest => quest.completed).length;
    const totalQuests = quests.length;
    const activeQuests = totalQuests - completedQuests;
    const sharedQuests = quests.filter(quest => quest.sharedWith.length > 0).length;
    const totalXp = quests.reduce((total, quest) => total + (quest.xpReward || 0), 0);
    const earnedXp = quests
      .filter(quest => quest.completed)
      .reduce((total, quest) => total + (quest.xpReward || 0), 0);

    return (
      <View style={styles.statsContainer}>
        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="star.fill" size={20} color={colors.warning} />
          </View>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {earnedXp}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            XP Earned
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="flag.fill" size={20} color={colors.success} />
          </View>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {completedQuests}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Completed
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="flame.fill" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {activeQuests}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Active
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="person.2.fill" size={20} color={colors.accent} />
          </View>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {sharedQuests}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Shared
          </Text>
        </GlassView>
      </View>
    );
  };

  const renderQuestsByDifficulty = () => {
    const questsByDifficulty = {
      legendary: quests.filter(q => q.difficulty === 'legendary' && !q.completed),
      hard: quests.filter(q => q.difficulty === 'hard' && !q.completed),
      medium: quests.filter(q => q.difficulty === 'medium' && !q.completed),
      easy: quests.filter(q => q.difficulty === 'easy' && !q.completed),
    };

    const completedQuests = quests.filter(q => q.completed);

    return (
      <View style={styles.questsSection}>
        {/* Active Quests by Difficulty */}
        {Object.entries(questsByDifficulty).map(([difficulty, questList]) => {
          if (questList.length === 0) return null;
          
          const difficultyConfig = getDifficultyConfig(difficulty);
          
          return (
            <View key={difficulty} style={styles.difficultySection}>
              <View style={styles.difficultySectionHeader}>
                <IconSymbol name={difficultyConfig.icon} size={20} color={difficultyConfig.color} />
                <Text style={[styles.difficultySectionTitle, { color: difficultyConfig.color }]}>
                  {difficultyConfig.label} QUESTS ({questList.length})
                </Text>
              </View>
              
              {questList.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  allies={allies}
                  onToggleComplete={handleToggleQuest}
                  onToggleSubQuest={handleToggleSubQuest}
                  onPress={() => {
                    console.log('Quest pressed:', quest.title);
                    // TODO: Navigate to quest detail
                  }}
                  onShare={() => {
                    console.log('Share quest:', quest.title);
                    // TODO: Implement share functionality
                  }}
                />
              ))}
            </View>
          );
        })}

        {/* Completed Quests */}
        {completedQuests.length > 0 && (
          <View style={styles.difficultySection}>
            <View style={styles.difficultySectionHeader}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
              <Text style={[styles.difficultySectionTitle, { color: colors.success }]}>
                COMPLETED QUESTS ({completedQuests.length})
              </Text>
            </View>
            
            {completedQuests.slice(0, 5).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                allies={allies}
                onToggleComplete={handleToggleQuest}
                onToggleSubQuest={handleToggleSubQuest}
                onPress={() => {
                  console.log('Quest pressed:', quest.title);
                }}
                onShare={() => {
                  console.log('Share quest:', quest.title);
                }}
              />
            ))}
            
            {completedQuests.length > 5 && (
              <Text style={[styles.moreQuestsText, { color: colors.textSecondary }]}>
                +{completedQuests.length - 5} more completed quests
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Quest Board",
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
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
            tintColor={colors.primary}
          />
        }
      >
        {renderStats()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingIcon}>
              <IconSymbol name="sparkles" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading your quests...
            </Text>
          </View>
        ) : quests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <IconSymbol name="map" size={64} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Your Quest Board Awaits
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Begin your adventure by creating your first quest
            </Text>
            <Pressable
              onPress={() => setShowCreateModal(true)}
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol name="plus" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Start Your First Quest</Text>
            </Pressable>
          </View>
        ) : (
          renderQuestsByDifficulty()
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateQuestModal
          onClose={() => setShowCreateModal(false)}
          onCreateQuest={handleCreateQuest}
          allies={allies.filter(a => a.status === 'allied')}
        />
      </Modal>

      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <InviteAllyModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteAlly}
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? undefined : colors.surface,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questsSection: {
    flex: 1,
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  difficultySectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  moreQuestsText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
