import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../config/colors';

export default function AppointmentsScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Mis Citas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  text: { color: COLORS.textDark, fontSize: 18, fontWeight: 'bold' }
});