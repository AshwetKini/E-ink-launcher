import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { Plus, X } from 'lucide-react-native';

interface AddTaskInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export function AddTaskInput({ onAdd, placeholder = 'Add a new task...' }: AddTaskInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue('');
    }
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={Colors.ink[60]}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          blurOnSubmit={true}
        />
        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={10}>
            <X size={16} color={Colors.ink[60]} />
          </Pressable>
        )}
      </View>
      {value.trim().length > 0 && (
        <Pressable onPress={handleSubmit} style={styles.addButton}>
          <Plus size={18} color={Colors.ink[100]} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  focused: {
    borderColor: Colors.ink[30],
    borderWidth: 2,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'web' ? Spacing.md : Spacing.md - 2,
  },
  input: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.ink[10],
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: Spacing.xs,
  },
  addButton: {
    backgroundColor: Colors.ink[10],
    padding: Spacing.md,
    borderRadius: 2,
  },
});
