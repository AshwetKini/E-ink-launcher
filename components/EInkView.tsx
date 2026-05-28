import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface EInkCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'inset' | 'flat';
}

export function EInkCard({ children, style, variant = 'raised' }: EInkCardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'inset':
        return styles.inset;
      case 'flat':
        return styles.flat;
      case 'raised':
      default:
        return styles.raised;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.ink[100],
    borderWidth: 1,
    borderColor: Colors.ink[70],
    padding: 16,
    marginVertical: 8,
  },
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inset: {
    backgroundColor: Colors.ink[90],
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: -1,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
  },
});
