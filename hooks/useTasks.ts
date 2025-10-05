
import { useState, useEffect } from 'react';
import { Task, TaskList, Partner, SubTask } from '@/types/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@tasks';
const PARTNERS_STORAGE_KEY = '@partners';
const TASK_LISTS_STORAGE_KEY = '@task_lists';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, partnersData, taskListsData] = await Promise.all([
        AsyncStorage.getItem(TASKS_STORAGE_KEY),
        AsyncStorage.getItem(PARTNERS_STORAGE_KEY),
        AsyncStorage.getItem(TASK_LISTS_STORAGE_KEY),
      ]);

      if (tasksData) {
        const parsedTasks = JSON.parse(tasksData);
        // Ensure backward compatibility for tasks without subTasks
        const migratedTasks = parsedTasks.map((task: any) => ({
          ...task,
          subTasks: task.subTasks || [],
          isChecklist: task.isChecklist || false,
        }));
        setTasks(migratedTasks);
      }
      if (partnersData) setPartners(JSON.parse(partnersData));
      if (taskListsData) setTaskLists(JSON.parse(taskListsData));
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newTasks?: Task[], newPartners?: Partner[], newTaskLists?: TaskList[]) => {
    try {
      const promises = [];
      
      if (newTasks) {
        promises.push(AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks)));
      }
      if (newPartners) {
        promises.push(AsyncStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(newPartners)));
      }
      if (newTaskLists) {
        promises.push(AsyncStorage.setItem(TASK_LISTS_STORAGE_KEY, JSON.stringify(newTaskLists)));
      }

      await Promise.all(promises);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: taskData.subTasks || [],
      isChecklist: taskData.isChecklist || false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveData(updatedTasks);
    return newTask;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const addSubTask = async (taskId: string, subTaskTitle: string) => {
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskTitle,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: [...task.subTasks, newSubTask],
            updatedAt: new Date(),
          }
        : task
    );
    setTasks(updatedTasks);
    await saveData(updatedTasks);
    return newSubTask;
  };

  const updateSubTask = async (taskId: string, subTaskId: string, updates: Partial<SubTask>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(subTask =>
              subTask.id === subTaskId
                ? { ...subTask, ...updates, updatedAt: new Date() }
                : subTask
            ),
            updatedAt: new Date(),
          }
        : task
    );
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const deleteSubTask = async (taskId: string, subTaskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId),
            updatedAt: new Date(),
          }
        : task
    );
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const createTaskList = async (listData: Omit<TaskList, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    const newList: TaskList = {
      ...listData,
      id: Date.now().toString(),
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedLists = [...taskLists, newList];
    setTaskLists(updatedLists);
    await saveData(undefined, undefined, updatedLists);
    return newList;
  };

  const invitePartner = async (email: string, name: string) => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name,
      email,
      status: 'pending',
      invitedAt: new Date(),
    };

    const updatedPartners = [...partners, newPartner];
    setPartners(updatedPartners);
    await saveData(undefined, updatedPartners);
    return newPartner;
  };

  const updatePartnerStatus = async (partnerId: string, status: Partner['status']) => {
    const updatedPartners = partners.map(partner =>
      partner.id === partnerId ? { ...partner, status } : partner
    );
    setPartners(updatedPartners);
    await saveData(undefined, updatedPartners);
  };

  const shareTaskWithPartner = async (taskId: string, partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            sharedWith: [...task.sharedWith, partnerId],
            updatedAt: new Date(),
          }
        : task
    );
    setTasks(updatedTasks);
    await saveData(updatedTasks);
  };

  const createTaskForPartner = async (partnerId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignedTo'>) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      assignedTo: partnerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: taskData.subTasks || [],
      isChecklist: taskData.isChecklist || false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveData(updatedTasks);
    return newTask;
  };

  return {
    tasks,
    taskLists,
    partners,
    loading,
    createTask,
    updateTask,
    deleteTask,
    addSubTask,
    updateSubTask,
    deleteSubTask,
    createTaskList,
    invitePartner,
    updatePartnerStatus,
    shareTaskWithPartner,
    createTaskForPartner,
  };
};
