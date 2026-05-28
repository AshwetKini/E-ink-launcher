import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  Pressable,
  useWindowDimensions,
  TextInput,
  Animated,
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
  Camera,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
  Calculator,
  Music,
  Video,
  Image,
  FileText,
  Map,
  Settings,
  Briefcase,
  Search,
  X,
} from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

interface AppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'primary' | 'secondary';
}

const defaultApps: AppItem[] = [
  { id: '1', name: 'Phone', icon: <Phone size={24} color={Colors.ink[10]} />, category: 'primary' },
  { id: '2', name: 'Messages', icon: <MessageSquare size={24} color={Colors.ink[10]} />, category: 'primary' },
  { id: '3', name: 'Mail', icon: <Mail size={24} color={Colors.ink[10]} />, category: 'primary' },
  { id: '4', name: 'Browser', icon: <Globe size={24} color={Colors.ink[10]} />, category: 'primary' },
  { id: '5', name: 'Camera', icon: <Camera size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '6', name: 'Clock', icon: <Clock size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '7', name: 'Calendar', icon: <Calendar size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '8', name: 'Calculator', icon: <Calculator size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '9', name: 'Music', icon: <Music size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '10', name: 'Videos', icon: <Video size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '11', name: 'Gallery', icon: <Image size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '12', name: 'Notes', icon: <FileText size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '13', name: 'Maps', icon: <Map size={24} color={Colors.ink[10]} />, category: 'secondary' },
  { id: '15', name: 'Settings', icon: <Settings size={24} color={Colors.ink[10]} />, category: 'secondary' },
];

export default function AppsScreen() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    'SpaceMono-Bold': SpaceMono_700Bold,
  });

  const [apps] = useState<AppItem[]>(defaultApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 400;
  const isTablet = width >= 768;
  const numColumns = isTablet ? 5 : isSmallScreen ? 3 : 4;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter((app) =>
      app.name.toLowerCase().includes(query)
    );
  }, [apps, searchQuery]);

  const primaryApps = filteredApps.filter((app) => app.category === 'primary');
  const secondaryApps = filteredApps.filter((app) => app.category === 'secondary');

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.ink[90]} />
      <View style={[styles.responsiveContainer, isTablet && styles.tabletContainer]}>
        <View style={styles.header}>
          <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>APPS</Text>
          <Text style={styles.subtitle}>{filteredApps.length} apps installed</Text>
        </View>

        <View style={[
          styles.searchContainer,
          searchFocused && styles.searchContainerFocused
        ]}>
          <Search size={isSmallScreen ? 14 : 16} color={searchFocused ? Colors.ink[30] : Colors.ink[50]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for apps..."
            placeholderTextColor={Colors.ink[60]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClear} style={styles.clearButton}>
              <X size={16} color={Colors.ink[50]} />
            </Pressable>
          )}
        </View>

        {searchQuery.trim().length === 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PRIMARY</Text>
            <Text style={styles.sectionCount}>{primaryApps.length}</Text>
          </View>
        )}

        <FlatList
          data={searchQuery.trim().length > 0 ? filteredApps : [...primaryApps, ...secondaryApps]}
          keyExtractor={(item) => item.id}
          key={`${numColumns}-${searchQuery}`}
          renderItem={({ item, index }) => {
            const showHeader = !searchQuery.trim() && index === primaryApps.length && primaryApps.length > 0;

            return (
              <>
                {showHeader && (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>SECONDARY</Text>
                    <Text style={styles.sectionCount}>{secondaryApps.length}</Text>
                  </View>
                )}
                <Pressable
                  style={({ pressed }) => [
                    styles.appItem,
                    pressed && styles.appItemPressed,
                    { maxWidth: `${100 / numColumns - 2}%` },
                  ]}
                >
                  <View style={[
                    styles.appIcon,
                    isSmallScreen && styles.appIconSmall
                  ]}>
                    {React.cloneElement(item.icon, { size: isSmallScreen ? 20 : 22 })}
                  </View>
                  <Text style={[styles.appLabel, isSmallScreen && styles.appLabelSmall]}>
                    {item.name}
                  </Text>
                </Pressable>
              </>
            );
          }}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.gridContent,
            isTablet && styles.gridContentTablet,
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchQuery.trim().length > 0 ? (
              <View style={styles.searchResultHeader}>
                <Text style={styles.searchResultText}>
                  {filteredApps.length} result{filteredApps.length !== 1 ? 's' : ''} for "{searchQuery}"
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Search size={48} color={Colors.ink[70]} />
              <Text style={styles.emptyTitle}>NO APPS FOUND</Text>
              <Text style={styles.emptyMessage}>
                No apps match your search
              </Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink[90],
  },
  responsiveContainer: {
    flex: 1,
  },
  tabletContainer: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 24,
    color: Colors.ink[10],
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  titleSmall: {
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[50],
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
  },
  searchContainerFocused: {
    borderColor: Colors.ink[40],
    borderWidth: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'SpaceMono',
    fontSize: 13,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.ink[90],
  },
  sectionTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.ink[50],
  },
  sectionCount: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    color: Colors.ink[60],
    letterSpacing: 0.5,
  },
  searchResultHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchResultText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[50],
    letterSpacing: 0.5,
  },
  gridContent: {
    padding: Spacing.md,
  },
  gridContentTablet: {
    padding: Spacing.lg,
  },
  row: {
    justifyContent: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  appItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[80],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  appItemPressed: {
    backgroundColor: Colors.ink[80],
    borderColor: Colors.ink[70],
  },
  appIcon: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconSmall: {
    marginBottom: Spacing.xs,
  },
  appLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.ink[20],
    textAlign: 'center',
  },
  appLabelSmall: {
    fontSize: 9,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    letterSpacing: 1,
    color: Colors.ink[50],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[60],
    textAlign: 'center',
  },
});
