import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import { useWindowDimensions } from 'react-native';

interface WeeklyChartWidgetProps {
  data: Array<{ day: string; value: number }>;
}

export function WeeklyChartWidget({ data }: WeeklyChartWidgetProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
      <View style={styles.header}>
        <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
          THIS WEEK
        </Text>
      </View>

      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const isToday = index === new Date().getDay();

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${barHeight}%`,
                    },
                    isToday && styles.todayBar,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  isSmallScreen && styles.dayLabelSmall,
                  isToday && styles.todayLabel,
                ]}
              >
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const defaultData = days.map((day, i) => ({
  day,
  value: Math.floor(Math.random() * 5) + 1,
}));

WeeklyChartWidget.defaultProps = {
  data: defaultData,
};

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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: 20,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.ink[70],
    minWidth: 8,
  },
  todayBar: {
    backgroundColor: Colors.ink[20],
  },
  dayLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[50],
    marginTop: Spacing.sm,
    letterSpacing: 0,
  },
  dayLabelSmall: {
    fontSize: 9,
  },
  todayLabel: {
    color: Colors.ink[10],
    fontWeight: '700',
  },
});
