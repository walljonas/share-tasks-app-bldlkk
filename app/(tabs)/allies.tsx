
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import QuestCard from '@/components/QuestCard';
import { useTasks } from '@/hooks/useTasks';
import { Stack } from 'expo-router';
import { GlassView } from 'expo-glass-effect';
import CreateQuestModal from '@/components/CreateQuestModal';
import InviteAllyModal from '@/components/InviteAllyModal';
import PartnerCard from '@/components/PartnerCard';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';

export default function AlliesScreen() {
  const theme = useTheme();
  const {
    tasks: quests,
    partners: allies,
    loading,
    createTask: createQuest,
    updateTask: updateQuest,
    updateSubTask: updateSubQuest,
    invitePartner: inviteAlly,
    acceptPartner: acceptAlly,
    declinePartner: declineAlly,
  } = useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedAlly, setSelectedAlly] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleInviteAlly = async (email: string, name: string) => {
    await inviteAlly(email, name);
    setShowInviteModal(false);
  };

  const handleAcceptAlly = async (allyId: string) => {
    await acceptAlly(allyId);
  };

  const handleDeclineAlly = async (allyId: string) => {
    await declineAlly(allyId);
  };

  const handleCreateQuestForAlly = async (questData: any) => {
    if (selectedAlly) {
      const questWithAssignment = {
        ...questData,
        assignedTo: selectedAlly,
        sharedWith: [selectedAlly],
      };
      await createQuest(questWithAssignment);
    }
    setShowCreateModal(false);
    setSelectedAlly(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getQuestsForAlly = (allyId: string) => {
    return quests.filter(quest => 
      quest.assignedTo === allyId || quest.sharedWith.includes(allyId)
    );
  };

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

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowInviteModal(true);
      }}
      style={[styles.headerButton, { backgroundColor: colors.primary }]}
    >
      <IconSymbol name="person.badge.plus" size={16} color="white" />
    </Pressable>
  );

  const renderStats = () => {
    const alliedCount = allies.filter(ally => ally.status === 'allied').length;
    const pendingCount = allies.filter(ally => ally.status === 'invited').length;
    const sharedQuests = quests.filter(quest => quest.sharedWith.length > 0).length;
    const assignedQuests = quests.filter(quest => quest.assignedTo).length;

    return (
      <View style={styles.statsContainer}>
        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {alliedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Quest Allies
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="clock.fill" size={20} color={colors.warning} />
          </View>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {pendingCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Pending
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={20} color={colors.accent} />
          </View>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {sharedQuests}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Shared
          </Text>
        </GlassView>

        <GlassView style={styles.statCard} glassEffectStyle="regular">
          <View style={styles.statIcon}>
            <IconSymbol name="person.fill.checkmark" size={20} color={colors.success} />
          </View>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {assignedQuests}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Assigned
          </Text>
        </GlassView>
      </View>
    );
  };

  const pendingAllies = allies.filter(ally => ally.status === 'invited');
  const activeAllies = allies.filter(ally => ally.status === 'allied');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Quest Allies",
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

        {/* Pending Ally Invitations */}
        {pendingAllies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.fill" size={20} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: colors.warning }]}>
                PENDING INVITATIONS ({pendingAllies.length})
              </Text>
            </View>

            {pendingAllies.map((ally) => (
              <PartnerCard
                key={ally.id}
                partner={ally}
                onAccept={() => handleAcceptAlly(ally.id)}
                onDecline={() => handleDeclineAlly(ally.id)}
              />
            ))}
          </View>
        )}

        {/* Active Allies */}
        {activeAllies.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                YOUR QUEST ALLIES ({activeAllies.length})
              </Text>
            </View>

            {activeAllies.map((ally) => {
              const allyQuests = getQuestsForAlly(ally.id);
              const completedQuests = allyQuests.filter(q => q.completed).length;
              const totalXp = allyQuests
                .filter(q => q.completed)
                .reduce((total, q) => total + (q.xpReward || 0), 0);

              return (
                <View key={ally.id} style={styles.allySection}>
                  <GlassView
                    style={[
                      styles.allyCard,
                      Platform.OS !== 'ios' && { backgroundColor: colors.surface },
                    ]}
                    glassEffectStyle="regular"
                  >
                    <View style={styles.allyHeader}>
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
                          <Text style={[styles.allyEmail, { color: colors.textSecondary }]}>
                            {ally.email}
                          </Text>
                          <View style={styles.allyStats}>
                            <View style={styles.allyStatItem}>
                              <IconSymbol name="star.fill" size={12} color={colors.warning} />
                              <Text style={[styles.allyStatText, { color: colors.warning }]}>
                                {totalXp} XP
                              </Text>
                            </View>
                            <View style={styles.allyStatItem}>
                              <IconSymbol name="flag.fill" size={12} color={colors.success} />
                              <Text style={[styles.allyStatText, { color: colors.success }]}>
                                {completedQuests} completed
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <Pressable
                        onPress={() => {
                          setSelectedAlly(ally.id);
                          setShowCreateModal(true);
                        }}
                        style={[styles.createQuestButton, { backgroundColor: colors.success }]}
                      >
                        <IconSymbol name="plus" size={16} color="white" />
                        <Text style={styles.createQuestButtonText}>Assign Quest</Text>
                      </Pressable>
                    </View>
                  </GlassView>

                  {/* Ally's Quests */}
                  {allyQuests.length > 0 && (
                    <View style={styles.allyQuests}>
                      <Text style={[styles.allyQuestsTitle, { color: colors.text }]}>
                        Shared Quests ({allyQuests.length})
                      </Text>
                      {allyQuests.slice(0, 3).map((quest) => (
                        <QuestCard
                          key={quest.id}
                          quest={quest}
                          allies={allies}
                          onToggleComplete={handleToggleQuest}
                          onToggleSubQuest={handleToggleSubQuest}
                          onPress={() => {
                            console.log('Quest pressed:', quest.title);
                          }}
                        />
                      ))}
                      {allyQuests.length > 3 && (
                        <Text style={[styles.moreQuestsText, { color: colors.textSecondary }]}>
                          +{allyQuests.length - 3} more quests with {ally.name}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <IconSymbol name="person.2" size={64} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Quest Allies Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Invite friends to join your adventures and share quests together
            </Text>
            <Pressable
              onPress={() => setShowInviteModal(true)}
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol name="person.badge.plus" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Invite Your First Ally</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateQuestModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedAlly(null);
          }}
          onCreateQuest={handleCreateQuestForAlly}
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
    paddingBottom: 100,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  allySection: {
    marginBottom: 20,
  },
  allyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  allyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  allyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  allyInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  allyDetails: {
    flex: 1,
  },
  allyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  allyEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  allyStats: {
    flexDirection: 'row',
    gap: 16,
  },
  allyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allyStatText: {
    fontSize: 12,
    fontWeight: '600',
  },
  createQuestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  createQuestButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  allyQuests: {
    paddingLeft: 16,
  },
  allyQuestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  moreQuestsText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
