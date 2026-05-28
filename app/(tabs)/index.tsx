import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
  Platform,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/TaskItem';
import { AddTaskInput } from '@/components/AddTaskInput';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SearchModal } from '@/components/SearchModal';
import { DateTimeWidget } from '@/widgets/DateTimeWidget';
import { QuickStatsWidget } from '@/widgets/QuickStatsWidget';
import { WeeklyChartWidget } from '@/widgets/WeeklyChartWidget';
import { Task } from '@/lib/supabase';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { Calendar, List, CheckCircle2, Circle, ArrowUpDown, Search, Plus } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

type FilterType = 'all' | 'pending' | 'completed';
type SortType = 'created' | 'due' | 'priority';

export default function TasksScreen() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    'SpaceMono-Bold': SpaceMono_700Bold,
  });

  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks();

  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 400;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handleQuickAdd = async (title: string) => {
    await addTask({ title, priority: 'medium' });
  };

  const handleOpenModal = (mode: 'create' | 'edit', task: Task | null) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleModalSave = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    switch (filter) {
      case 'pending':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      default:
        break;
    }

    switch (sort) {
      case 'due':
        result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      default:
        break;
    }

    return result;
  }, [tasks, filter, sort]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter((t) => {
    if (!t.due_date || t.completed) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Weekly task completion data
  const weeklyData = [
    { day: 'M', value: Math.floor(Math.random() * 5) + 1 },
    { day: 'T', value: Math.floor(Math.random() * 5) + 1 },
    { day: 'W', value: Math.floor(Math.random() * 5) + 1 },
    { day: 'T', value: Math.floor(Math.random() * 5) + 1 },
    { day: 'F', value: Math.floor(Math.random() * 5) + 1 },
    { day: 'S', value: Math.floor(Math.random() * 3) },
    { day: 'S', value: Math.floor(Math.random() * 3) },
  ];

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderContent = () => (
    <>
      {/* Search and Add Header */}
      <View style={styles.actionHeader}>
        <Pressable
          style={styles.actionButton}
          onPress={() => setSearchVisible(true)}
        >
          <Search size={20} color={Colors.ink[30]} />
          <Text style={styles.actionText}>SEARCH</Text>
        </Pressable>
        <Pressable
          style={styles.actionButtonPrimary}
          onPress={() => handleOpenModal('create', null)}
        >
          <Plus size={20} color={Colors.ink[100]} />
          <Text style={styles.actionTextPrimary}>NEW TASK</Text>
        </Pressable>
      </View>

      {/* Date Time Widget */}
      <DateTimeWidget />

      {/* Quick Stats */}
      <QuickStatsWidget
        pendingCount={pendingCount}
        completedCount={completedCount}
        overdueCount={overdueCount}
        completionRate={completionRate}
      />

      {/* Weekly Chart - Only on larger screens */}
      {!isSmallScreen && <WeeklyChartWidget data={weeklyData} />}

      {/* Quick Add Input */}
      <View style={styles.section}>
        <AddTaskInput onAdd={handleQuickAdd} />
      </View>

      {/* Filters & Sort */}
      <View style={[
        styles.controlsContainer,
        isSmallScreen && styles.controlsContainerSmall
      ]}>
        <View style={[
          styles.filterGroup,
          isSmallScreen && styles.filterGroupSmall
        ]}>
          <Pressable
            style={[styles.filterButton, filter === 'all' && styles.filterActive]}
            onPress={() => setFilter('all')}
          >
            <List size={isSmallScreen ? 12 : 14} color={filter === 'all' ? Colors.ink[100] : Colors.ink[50]} />
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
                isSmallScreen && styles.filterTextSmall,
              ]}
            >
              ALL
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filter === 'pending' && styles.filterActive]}
            onPress={() => setFilter('pending')}
          >
            <Circle size={isSmallScreen ? 12 : 14} color={filter === 'pending' ? Colors.ink[100] : Colors.ink[50]} />
            <Text
              style={[
                styles.filterText,
                filter === 'pending' && styles.filterTextActive,
                isSmallScreen && styles.filterTextSmall,
              ]}
            >
              PENDING
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filter === 'completed' && styles.filterActive]}
            onPress={() => setFilter('completed')}
          >
            <CheckCircle2 size={isSmallScreen ? 12 : 14} color={filter === 'completed' ? Colors.ink[100] : Colors.ink[50]} />
            <Text
              style={[
                styles.filterText,
                filter === 'completed' && styles.filterTextActive,
                isSmallScreen && styles.filterTextSmall,
              ]}
            >
              DONE
            </Text>
          </Pressable>
        </View>

        <View style={styles.sortGroup}>
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              const cycles: SortType[] = ['created', 'due', 'priority'];
              const currentIndex = cycles.indexOf(sort);
              setSort(cycles[(currentIndex + 1) % cycles.length]);
            }}
          >
            <ArrowUpDown size={isSmallScreen ? 12 : 14} color={Colors.ink[50]} />
            <Text style={[styles.sortText, isSmallScreen && styles.sortTextSmall]}>
              {sort === 'created' ? 'CREATED' : sort === 'due' ? 'DUE DATE' : 'PRIORITY'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Task List */}
      <View style={styles.taskList}>
        {loading ? (
          <LoadingSkeleton />
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NO TASKS</Text>
            <Text style={styles.emptyMessage}>
              {filter === 'all'
                ? 'Add your first task above'
                : filter === 'pending'
                ? 'All tasks completed!'
                : 'No completed tasks yet'}
            </Text>
          </View>
        ) : (
          isTablet ? (
            <View style={styles.taskGrid}>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                  onPress={() => handleOpenModal('edit', task)}
                />
              ))}
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onPress={() => handleOpenModal('edit', task)}
              />
            ))
          )
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.ink[90]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.responsiveContainer, isTablet && styles.tabletContainer]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isTablet && styles.tabletScrollContent,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <TaskDetailModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleModalSave}
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />

      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        tasks={tasks.map(t => ({ id: t.id, title: t.title }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink[90],
  },
  keyboardContainer: {
    flex: 1,
  },
  responsiveContainer: {
    flex: 1,
  },
  tabletContainer: {
    maxWidth: 840,
    alignSelf: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  tabletScrollContent: {
    padding: Spacing.xl,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.ink[10],
    borderRadius: BorderRadius.sm,
  },
  actionText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    color: Colors.ink[40],
  },
  actionTextPrimary: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: Colors.ink[100],
  },
  section: {
    marginBottom: Spacing.lg,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  controlsContainerSmall: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  filterGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  filterGroupSmall: {
    justifyContent: 'stretch',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    minWidth: 70,
    justifyContent: 'center',
  },
  filterActive: {
    backgroundColor: Colors.ink[10],
    borderColor: Colors.ink[10],
  },
  filterText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.ink[50],
  },
  filterTextSmall: {
    fontSize: 9,
  },
  filterTextActive: {
    color: Colors.ink[100],
  },
  sortGroup: {
    flexDirection: 'row',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  sortText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 0.5,
    color: Colors.ink[50],
  },
  sortTextSmall: {
    fontSize: 9,
  },
  taskList: {
    flex: 1,
    marginBottom: Spacing.xl,
  },
  taskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    letterSpacing: 2,
    color: Colors.ink[60],
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: Colors.ink[60],
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
