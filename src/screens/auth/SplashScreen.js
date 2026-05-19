import React, { useEffect } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');  
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);
  // Se usa replace para que el usuario no pueda "volver"

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
      <Image 
        source={require('../../assets/huella.jpg')} 
        style={styles.logo}
        resizeMode="contain"
      />
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
  logo: {
    width: 300,
    height: 300,
  },
});