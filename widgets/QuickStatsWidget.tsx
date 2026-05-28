import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { useWindowDimensions } from 'react-native';
import { CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react-native';

interface QuickStatsWidgetProps {
  pendingCount: number;
  completedCount: number;
  overdueCount: number;
  completionRate: number;
}

export function QuickStatsWidget({
  pendingCount,
  completedCount,
  overdueCount,
  completionRate,
}: QuickStatsWidgetProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const stats = [
    {
      label: 'Pending',
      value: pendingCount,
      icon: <Circle size={16} color={Colors.ink[30]} />,
      color: Colors.ink[30],
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: <CheckCircle2 size={16} color={Colors.ink[20]} />,
      color: Colors.ink[20],
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: <Clock size={16} color={Colors.ink[10]} />,
      color: Colors.ink[10],
    },
  ];

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      <View style={styles.header}>
        <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
          OVERVIEW
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statItem, isSmallScreen && styles.statItemSmall]}>
            <View style={styles.statIcon}>{stat.icon}</View>
            <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Completion Rate</Text>
          <Text style={styles.progressValue}>{completionRate.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${completionRate}%` },
            ]}
          />
        </View>
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
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.ink[50],
  },
  titleSmall: {
    fontSize: 10,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.ink[95],
    borderRadius: BorderRadius.sm,
    marginHorizontal: Spacing.xs,
  },
  statItemSmall: {
    padding: Spacing.sm,
  },
  statIcon: {
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontFamily: 'SpaceMono',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.ink[10],
    marginBottom: Spacing.xs,
  },
  statValueSmall: {
    fontSize: 20,
  },
  statLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    color: Colors.ink[50],
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[40],
    letterSpacing: 0.5,
  },
  progressValue: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink[20],
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.ink[90],
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.ink[20],
  },
});
