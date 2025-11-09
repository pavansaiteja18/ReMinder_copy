import { useEffect } from 'react';
import { useTasksStore } from '@/store/tasksStore';

export const useTasks = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    refresh: fetchTasks,
  };
};
