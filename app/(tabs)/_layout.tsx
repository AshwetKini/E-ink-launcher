import { Tabs } from 'expo-router';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Home, Grid3X3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, isSmallScreen && styles.tabBarSmall],
        tabBarActiveTintColor: Colors.ink[10],
        tabBarInactiveTintColor: Colors.ink[60],
        tabBarLabelStyle: [styles.tabBarLabel, isSmallScreen && styles.tabBarLabelSmall],
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isSmallScreen ? 'TASKS' : 'TASKS',
          tabBarIcon: ({ color, size }) => (
            <Home size={isSmallScreen ? 18 : 20} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          title: 'APPS',
          tabBarIcon: ({ color, size }) => (
            <Grid3X3 size={isSmallScreen ? 18 : 20} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color, size }) => (
            <Settings size={isSmallScreen ? 18 : 20} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.ink[100],
    borderTopWidth: 1,
    borderTopColor: Colors.ink[90],
    height: 60,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarSmall: {
    height: 56,
    paddingTop: 6,
    paddingBottom: 6,
  },
  tabBarLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabBarLabelSmall: {
    fontSize: 9,
  },
  tabBarItem: {
    gap: 4,
  },
});
