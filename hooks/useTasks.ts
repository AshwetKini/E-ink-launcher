import { useState, useEffect, useCallback } from 'react';
import { supabase, Task } from '@/lib/supabase';
import { Alert } from 'react-native';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      // For offline experience, we'll use local storage fallback
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task: Partial<Task>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setTasks((prev) => [data, ...prev]);
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? data : task))
        );
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    return updateTask(id, { completed: !completed });
  }, [updateTask]);

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
    toggleComplete,
    refetch: fetchTasks,
  };
}
