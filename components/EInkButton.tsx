import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

interface EInkButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function EInkButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
  icon,
}: EInkButtonProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, fontSize: 12 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: Colors.ink[90],
          borderWidth: 1,
          borderColor: Colors.ink[70],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.ink[30],
        };
      case 'primary':
      default:
        return {
          backgroundColor: Colors.ink[10],
          borderWidth: 1,
          borderColor: Colors.ink[0],
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return Colors.ink[100];
      case 'secondary':
        return Colors.ink[30];
      case 'ghost':
        return Colors.ink[20];
      case 'outline':
        return Colors.ink[20];
      default:
        return Colors.ink[100];
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        getVariantStyles(),
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: sizeStyles.fontSize,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    gap: Spacing.sm,
  },
  text: {
    fontFamily: 'SpaceMono',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
