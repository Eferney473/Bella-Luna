// src/components/CustomButton.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/colors';

export const CustomButton = ({ title, onPress, variant = 'primary', loading = false, style }) => {
  // Determinar el color de fondo según la variante (primary o secondary/ciruela)
  const backgroundColor = variant === 'primary' ? COLORS.primary : COLORS.ciruela;

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }, style]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25, // Bordes bien redondeados como en tus capturas
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Sombra sutil en Android
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});