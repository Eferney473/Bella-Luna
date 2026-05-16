// src/screens/pets/PetsScreen.js
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function PetsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Text style={styles.text}>Módulo de Mascotas (Mis Mascotas)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  text: { color: COLORS.ciruela, fontSize: 18, fontWeight: 'bold' }
});