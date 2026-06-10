import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../config/colors';

export default function SplashScreen({ navigation }) {
  // Removido el setTimeout con navigation.replace para evitar conflictos con el estado global
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <FontAwesome5 name="paw" size={250} color={COLORS.oro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});