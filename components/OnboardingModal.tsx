import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius } from '@/constants/theme';
import {
  CheckCircle,
  Smartphone,
  WifiOff,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingModalProps {
  visible: boolean;
  onComplete: () => void;
}

const screens = [
  {
    id: 'welcome',
    icon: <Smartphone size={60} color={Colors.ink[10]} />,
    title: 'Welcome to E-Ink Launcher',
    description:
      'A minimal, distraction-free launcher designed for productivity and focus.',
  },
  {
    id: 'offline',
    icon: <WifiOff size={60} color={Colors.ink[10]} />,
    title: 'Works Offline',
    description:
      'All your tasks and data are stored locally. No internet required after initial setup.',
  },
  {
    id: 'features',
    icon: <Layers size={60} color={Colors.ink[10]} />,
    title: 'Stay Organized',
    description:
      'Organize tasks by priority, set due dates, and track your progress with statistics.',
  },
];

export function OnboardingModal({ visible, onComplete }: OnboardingModalProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef(screens.map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentScreen + 1) / screens.length,
      duration: 300,
      useNativeDriver: false,
    }).start();

    dotAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === currentScreen ? 1 : 0.3,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [currentScreen]);

  const goToNext = () => {
    if (currentScreen < screens.length - 1) {
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
        setCurrentScreen(currentScreen + 1);
        slideAnim.setValue(50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      onComplete();
    }
  };

  const goToPrevious = () => {
    if (currentScreen > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentScreen(currentScreen - 1);
        slideAnim.setValue(-50);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const screen = screens[currentScreen];

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentScreen + 1} / {screens.length}
            </Text>
          </View>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.screenContent,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>{screen.icon}</View>
            <Text style={styles.title}>{screen.title}</Text>
            <Text style={styles.description}>{screen.description}</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {dotAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: anim,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.navigation}>
            {currentScreen > 0 ? (
              <Pressable style={styles.navButton} onPress={goToPrevious}>
                <ArrowLeft size={18} color={Colors.ink[30]} />
                <Text style={styles.navTextPrev}>BACK</Text>
              </Pressable>
            ) : (
              <View style={styles.navButtonPlaceholder} />
            )}

            <Pressable style={styles.navButtonNext} onPress={goToNext}>
              <Text style={styles.navTextNext}>
                {currentScreen === screens.length - 1 ? 'GET STARTED' : 'NEXT'}
              </Text>
              <ArrowRight size={18} color={Colors.ink[100]} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink[90],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.xl + 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: Colors.ink[80],
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.ink[20],
  },
  progressText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    color: Colors.ink[50],
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 1,
    color: Colors.ink[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  screenContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.ink[100],
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.ink[80],
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink[10],
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    color: Colors.ink[40],
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  footer: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.ink[10],
    borderRadius: 4,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  navButtonPlaceholder: {
    width: 80,
  },
  navTextPrev: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.ink[30],
  },
  navButtonNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.ink[10],
    borderRadius: BorderRadius.sm,
  },
  navTextNext: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.ink[100],
  },
});
