import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Task } from '@/lib/supabase';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { X, Calendar, Clock, Tag, Check } from 'lucide-react-native';

interface TaskDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task: Task | null;
  mode: 'create' | 'edit';
}

const priorities: Array<{ value: Task['priority']; label: string }> = [
  { value: 'low', label: 'LOW' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'high', label: 'HIGH' },
];

export function TaskDetailModal({
  visible,
  onClose,
  onSave,
  task,
  mode,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (mode === 'edit' && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [task, mode]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'create' ? 'NEW TASK' : 'EDIT TASK'}
            </Text>
            <Pressable onPress={onClose} hitSlop={20}>
              <X size={24} color={Colors.ink[30]} />
            </Pressable>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TITLE</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor={Colors.ink[60]}
                autoFocus={mode === 'create'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add details..."
                placeholderTextColor={Colors.ink[60]}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PRIORITY</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((p) => (
                  <Pressable
                    key={p.value}
                    style={[
                      styles.priorityButton,
                      priority === p.value && styles.priorityActive,
                    ]}
                    onPress={() => setPriority(p.value)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        priority === p.value && styles.priorityTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DUE DATE</Text>
              <View style={styles.dateContainer}>
                <Calendar size={18} color={Colors.ink[40]} style={styles.inputIcon} />
                <TextInput
                  style={styles.dateInput}
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.ink[60]}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>
                {mode === 'create' ? 'CREATE' : 'SAVE'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    backgroundColor: Colors.ink[100],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.ink[80],
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink[90],
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.ink[10],
  },
  form: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.ink[50],
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.ink[10],
    backgroundColor: Colors.ink[100],
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: Colors.ink[10],
    borderColor: Colors.ink[10],
  },
  priorityText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.ink[30],
  },
  priorityTextActive: {
    color: Colors.ink[100],
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    paddingLeft: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  dateInput: {
    flex: 1,
    padding: Spacing.md,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.ink[10],
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.ink[90],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.ink[60],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.ink[40],
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.ink[10],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.ink[100],
  },
});
