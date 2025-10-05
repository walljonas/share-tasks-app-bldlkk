
export interface SubQuest {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  xpReward: number;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  allies: string[]; // Changed from collaborators
  sharedWith: string[];
  subQuests: SubQuest[]; // Changed from subTasks
  isMultiStep: boolean; // Changed from isChecklist
  xpReward: number;
  category: 'personal' | 'work' | 'health' | 'learning' | 'social' | 'creative';
  status: 'active' | 'completed' | 'paused' | 'failed';
}

export interface Ally {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'invited' | 'allied' | 'declined';
  invitedAt: Date;
  level: number;
  totalXp: number;
  questsCompleted: number;
}

export interface QuestBoard {
  id: string;
  title: string;
  description?: string;
  quests: Quest[];
  owner: string;
  allies: Ally[];
  createdAt: Date;
  updatedAt: Date;
  theme: string;
  emoji: string;
  level: number;
  totalXp: number;
}

// Legacy type aliases for backward compatibility
export type Task = Quest;
export type SubTask = SubQuest;
export type Partner = Ally;
export type TaskList = QuestBoard;
