import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  Pressable,
} from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import {
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Info,
  ChevronRight,
  Bell,
  Shield,
  Database,
  Palette,
  HelpCircle,
  Mail,
  Star,
  Github,
} from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

export default function SettingsScreen() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    'SpaceMono-Bold': SpaceMono_700Bold,
  });

  const [launchOnStartup, setLaunchOnStartup] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [darkMode] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    control?: React.ReactNode,
    onPress?: () => void
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {control}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.ink[90]} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>SETTINGS</Text>
          <Text style={styles.subtitle}>Customize your launcher</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LAUNCHER</Text>

          {renderSettingItem(
            <Smartphone size={20} color={Colors.ink[10]} />,
            'DEFAULT LAUNCHER',
            'Set as default home screen',
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SET</Text>
            </View>,
            () => {}
          )}

          {renderSettingItem(
            <Monitor size={20} color={Colors.ink[10]} />,
            'LAUNCH ON STARTUP',
            'Automatically start with device',
            <Switch
              value={launchOnStartup}
              onValueChange={setLaunchOnStartup}
              trackColor={{ false: Colors.ink[80], true: Colors.ink[30] }}
              thumbColor={launchOnStartup ? Colors.ink[100] : Colors.ink[60]}
              ios_backgroundColor={Colors.ink[80]}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYNC & STORAGE</Text>

          {renderSettingItem(
            offlineMode ? <WifiOff size={20} color={Colors.ink[30]} /> : <Wifi size={20} color={Colors.ink[30]} />,
            'OFFLINE MODE',
            'All data stored locally',
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: Colors.ink[80], true: Colors.ink[30] }}
              thumbColor={offlineMode ? Colors.ink[100] : Colors.ink[60]}
              ios_backgroundColor={Colors.ink[80]}
            />
          )}

          {renderSettingItem(
            <Bell size={20} color={Colors.ink[10]} />,
            'NOTIFICATIONS',
            'Remind about upcoming tasks',
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.ink[80], true: Colors.ink[30] }}
              thumbColor={notifications ? Colors.ink[100] : Colors.ink[60]}
              ios_backgroundColor={Colors.ink[80]}
            />
          )}

          {renderSettingItem(
            <Database size={20} color={Colors.ink[10]} />,
            'CACHE SIZE',
            '12.4 MB used',
            <Pressable style={styles.clearButton}>
              <Text style={styles.clearText}>CLEAR</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>

          {renderSettingItem(
            <Palette size={20} color={Colors.ink[10]} />,
            'THEME',
            'E-ink monochrome display',
            <View style={styles.themeTag}>
              <Text style={styles.themeTagText}>ACTIVE</Text>
            </View>,
            () => {}
          )}

          <View style={styles.gridInfo}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>ICON SIZE</Text>
              <Text style={styles.gridValue}>MEDIUM</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>GRID</Text>
              <Text style={styles.gridValue}>4 COL</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>ANIMATIONS</Text>
              <Text style={styles.gridValue}>ON</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>

          {renderSettingItem(
            <Info size={20} color={Colors.ink[10]} />,
            'VERSION',
            '1.0.0 (Build 1)',
            <Text style={styles.versionText}>Latest</Text>
          )}

          {renderSettingItem(
            <Shield size={20} color={Colors.ink[10]} />,
            'PRIVACY POLICY',
            'How we handle your data',
            <ChevronRight size={16} color={Colors.ink[50]} />
          )}

          {renderSettingItem(
            <HelpCircle size={20} color={Colors.ink[10]} />,
            'HELP & SUPPORT',
            'Get assistance and FAQs',
            <ChevronRight size={16} color={Colors.ink[50]} />
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>E-Ink Launcher</Text>
              <Text style={styles.infoVersion}>Version 1.0.0</Text>
            </View>
            <Text style={styles.infoText}>
              A minimal, offline-first Android launcher designed for distraction-free productivity. Built with React Native and Expo.
            </Text>
            <View style={styles.socialLinks}>
              <Pressable style={styles.socialButton}>
                <Github size={18} color={Colors.ink[30]} />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Star size={18} color={Colors.ink[30]} />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Mail size={18} color={Colors.ink[30]} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with care for productivity</Text>
          <Text style={styles.footerCopyright}>© 2024 E-Ink Launcher</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink[90],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 24,
    color: Colors.ink[10],
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[50],
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.ink[50],
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink[95],
    borderRadius: BorderRadius.sm,
  },
  settingItemPressed: {
    backgroundColor: Colors.ink[95],
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ink[95],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 12,
    letterSpacing: 0.5,
    color: Colors.ink[10],
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[50],
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: Colors.ink[10],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    color: Colors.ink[100],
  },
  clearButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.ink[90],
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.ink[70],
  },
  clearText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.ink[40],
  },
  themeTag: {
    backgroundColor: Colors.ink[10],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  themeTagText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 9,
    letterSpacing: 0.5,
    color: Colors.ink[100],
  },
  versionText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[40],
    letterSpacing: 0.3,
  },
  gridInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    marginHorizontal: Spacing.sm,
  },
  gridItem: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.ink[95],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  gridLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    letterSpacing: 1,
    color: Colors.ink[50],
    marginBottom: Spacing.xs,
  },
  gridValue: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    color: Colors.ink[10],
  },
  infoCard: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: Colors.ink[95],
    borderRadius: BorderRadius.md,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    color: Colors.ink[10],
  },
  infoVersion: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[50],
    letterSpacing: 0.5,
  },
  infoText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[40],
    lineHeight: 18,
    letterSpacing: 0.2,
    marginBottom: Spacing.lg,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  socialButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ink[100],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.ink[80],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[50],
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  footerCopyright: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    color: Colors.ink[60],
    letterSpacing: 0.3,
  },
});
