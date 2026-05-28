import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { Search, X, ArrowRight, Clock, Star, TrendingUp } from 'lucide-react-native';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'app' | 'setting';
  icon: React.ReactNode;
}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  tasks: Array<{ id: string; title: string }>;
}

export function SearchModal({ visible, onClose, tasks }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filteredTasks = tasks
        .filter((task) => task.title.toLowerCase().includes(query))
        .slice(0, 5)
        .map((task) => ({
          id: task.id,
          title: task.title,
          type: 'task' as const,
          icon: <Clock size={18} color={Colors.ink[30]} />,
        }));

      setResults(filteredTasks);
    } else {
      // Show quick actions
    }
  }, [searchQuery, tasks]);

  const quickActions = [
    {
      id: 'add-task',
      title: 'Create new task',
      type: 'task' as const,
      icon: <Star size={18} color={Colors.ink[30]} />,
    },
    {
      id: 'view-completed',
      title: 'View completed tasks',
      type: 'task' as const,
      icon: <TrendingUp size={18} color={Colors.ink[30]} />,
    },
    {
      id: 'open-settings',
      title: 'Open Settings',
      type: 'setting' as const,
      icon: <ArrowRight size={18} color={Colors.ink[30]} />,
    },
  ];

  const displayResults = searchQuery.trim().length > 0 ? results : quickActions;

  const handleClose = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.ink[50]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks, apps, settings..."
              placeholderTextColor={Colors.ink[60]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={20} color={Colors.ink[50]} />
            </Pressable>
          </View>

          <View style={styles.divider} />

          {displayResults.length === 0 && searchQuery.trim().length > 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NO RESULTS</Text>
              <Text style={styles.emptyMessage}>
                No tasks found for "{searchQuery}"
              </Text>
            </View>
          ) : (
            <FlatList
              data={displayResults}
              keyExtractor={(item) => item.id}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.resultItem,
                    pressed && styles.resultItemPressed,
                  ]}
                >
                  <View style={styles.resultIcon}>{item.icon}</View>
                  <View style={styles.resultContent}>
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    <Text style={styles.resultType}>{item.type.toUpperCase()}</Text>
                  </View>
                  <ArrowRight size={16} color={Colors.ink[70]} />
                </Pressable>
              )}
              ListHeaderComponent={
                searchQuery.trim().length === 0 ? (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
                  </View>
                ) : (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      {displayResults.length} RESULT{displayResults.length !== 1 ? 'S' : ''}
                    </Text>
                  </View>
                )
              }
            />
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    backgroundColor: Colors.ink[100],
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.ink[80],
    maxHeight: '70%',
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
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
  closeButton: {
    padding: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ink[90],
    marginHorizontal: Spacing.lg,
  },
  resultsList: {
    flex: 1,
  },
  sectionHeader: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.ink[50],
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink[95],
  },
  resultItemPressed: {
    backgroundColor: Colors.ink[95],
  },
  resultIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ink[95],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ink[10],
    marginBottom: 2,
  },
  resultType: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    letterSpacing: 1,
    color: Colors.ink[50],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyTitle: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.ink[50],
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[60],
    textAlign: 'center',
  },
});
