import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Trash2, CheckCircle, Archive, MoreVertical } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

interface SwipeableTaskItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  onComplete: () => void;
}

export function SwipeableTaskItem({
  children,
  onDelete,
  onComplete,
}: SwipeableTaskItemProps) {
  const position = useRef(new Animated.Value(0)).current;
  const [showActions, setShowActions] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        const newValue = Math.max(-SCREEN_WIDTH, Math.min(SCREEN_WIDTH / 3, gesture.dx));
        position.setValue(newValue);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swiped left - show delete
          Animated.spring(position, {
            toValue: -120,
            useNativeDriver: true,
          }).start();
          setShowActions(true);
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          // Swiped right - quick complete
          Animated.sequence([
            Animated.spring(position, {
              toValue: SCREEN_WIDTH / 2,
              useNativeDriver: true,
            }),
            Animated.spring(position, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
          onComplete();
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setShowActions(false);
        }
      },
    })
  ).current;

  const handleDelete = () => {
    Animated.timing(position, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
    });
  };

  const handleCancel = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setShowActions(false);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setShowActions(false);
  };

  useEffect(() => {
    return () => {
      Animated.spring(position, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background action button */}
      <Animated.View
        style={[
          styles.backgroundAction,
          {
            transform: [
              {
                translateX: position.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0],
                  outputRange: [-20, 120],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={24} color={Colors.ink[100]} />
          <View style={styles.buttonBorder} />
        </TouchableOpacity>
      </Animated.View>

      {/* Foreground content */}
      <Animated.View
        style={[
          styles.foreground,
          { transform: [{ translateX: position }] },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  backgroundAction: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: Spacing.sm,
  },
  deleteButton: {
    width: 50,
    height: '90%',
    backgroundColor: Colors.ink[10],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  buttonBorder: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: Colors.ink[100],
  },
  foreground: {
    backgroundColor: Colors.ink[100],
    zIndex: 1,
  },
});
