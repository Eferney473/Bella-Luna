import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Usamos la huella de FontAwesome
import { COLORS } from '../../config/colors';

export const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      {/* Icono de huella grande centrado */}
      <FontAwesome5 name="paw" size={250} color={COLORS.oro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});