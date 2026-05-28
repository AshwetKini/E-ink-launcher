import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { useWindowDimensions } from 'react-native';

export function DateTimeWidget() {
  const [time, setTime] = useState(new Date());
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      <View style={styles.timeContainer}>
        <Text style={[styles.time, isSmallScreen && styles.timeSmall]}>
          {formatTime(time)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.dateContainer}>
        <Text style={[styles.date, isSmallScreen && styles.dateSmall]}>
          {formatDate(time)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  containerSmall: {
    padding: Spacing.md,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  time: {
    fontFamily: 'SpaceMono',
    fontSize: 56,
    fontWeight: '700',
    color: Colors.ink[10],
    letterSpacing: -1,
  },
  timeSmall: {
    fontSize: 42,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ink[80],
    marginVertical: Spacing.md,
  },
  dateContainer: {
    alignItems: 'center',
  },
  date: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    color: Colors.ink[40],
    letterSpacing: 0.5,
  },
  dateSmall: {
    fontSize: 12,
  },
});
