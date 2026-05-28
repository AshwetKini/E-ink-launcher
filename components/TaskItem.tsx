import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Task } from '@/lib/supabase';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { Circle, Check, Clock, AlertCircle, Trash2 } from 'lucide-react-native';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onPress: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onPress }: TaskItemProps) {
  const [pressed, setPressed] = useState(false);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const getPriorityIcon = () => {
    const size = isSmallScreen ? 12 : 14;
    switch (task.priority) {
      case 'high':
        return <AlertCircle size={size} color={Colors.ink[20]} />;
      case 'low':
        return <Clock size={size} color={Colors.ink[60]} />;
      case 'medium':
      default:
        return null;
    }
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Pressable
      onPress={() => onPress(task)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.container,
        pressed && styles.pressed,
        task.completed && styles.completed,
        isSmallScreen && styles.containerSmall,
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task.id, task.completed)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {task.completed ? (
          <View style={styles.checkedBox}>
            <Check size={isSmallScreen ? 14 : 16} color={Colors.ink[100]} />
          </View>
        ) : (
          <View style={[
            styles.uncheckedBox,
            isSmallScreen && styles.checkboxSmall
          ]} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completedText,
              isSmallScreen && styles.titleSmall,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {getPriorityIcon()}
        </View>

        {task.due_date && (
          <View style={styles.dueDate}>
            <Clock size={isSmallScreen ? 10 : 12} color={Colors.ink[60]} />
            <Text style={[styles.dueText, isSmallScreen && styles.dueTextSmall]}>
              {formatDueDate(task.due_date)}
            </Text>
          </View>
        )}

        {task.description && !isSmallScreen && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={isSmallScreen ? 14 : 16} color={Colors.ink[60]} />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[90],
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  containerSmall: {
    padding: Spacing.sm,
  },
  pressed: {
    backgroundColor: Colors.ink[90],
    transform: [{ scale: 0.99 }],
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkedBox: {
    width: 20,
    height: 20,
    backgroundColor: Colors.ink[20],
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.ink[10],
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    backgroundColor: Colors.ink[100],
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.ink[70],
  },
  checkboxSmall: {
    width: 16,
    height: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink[10],
    flex: 1,
    lineHeight: 20,
  },
  titleSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.ink[50],
  },
  description: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    color: Colors.ink[40],
    marginTop: Spacing.xs,
    lineHeight: 16,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  dueText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[60],
    letterSpacing: 0.3,
  },
  dueTextSmall: {
    fontSize: 10,
  },
  deleteButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
