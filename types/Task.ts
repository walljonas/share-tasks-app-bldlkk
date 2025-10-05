
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  collaborators: string[];
  sharedWith: string[];
  subTasks: SubTask[];
  isChecklist: boolean;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: Date;
}

export interface TaskList {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  owner: string;
  collaborators: Partner[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
  emoji: string;
}
