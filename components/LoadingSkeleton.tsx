import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export function LoadingSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const shimmerStyle = {
    transform: [{ translateX }],
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonItem}>
          <View style={styles.skeletonCheckbox} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonTitle}>
              <Animated.View style={[styles.shimmer, shimmerStyle]} />
            </View>
            <View style={styles.skeletonSubtitle}>
              <Animated.View style={[styles.shimmer, shimmerStyle]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[90],
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
  skeletonCheckbox: {
    width: 20,
    height: 20,
    backgroundColor: Colors.ink[90],
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    height: 14,
    backgroundColor: Colors.ink[90],
    borderRadius: 2,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  skeletonSubtitle: {
    height: 10,
    backgroundColor: Colors.ink[90],
    borderRadius: 2,
    width: '60%',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.ink[95],
  },
});
