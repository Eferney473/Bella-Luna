import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { COLORS } from '../../config/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

import { FirebaseService } from '../../config/firebaseService';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el spinner del botón

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor rellena todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await FirebaseService.loginUser(email, password);
      // Al loguearse con éxito, el Listener global en App.jsx nos cambiará de pantalla automáticamente
    } catch (e) {
      // El error ya es manejado en el servicio
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/logoLogin.jpg')} style={{ width: 200, height: 200, marginBottom: 20 }} />
        </View>

        <View style={styles.formContainer}>
          <CustomInput 
            label="Correo Electrónico"
            iconName="mail" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <CustomInput 
            label="Contraseña"
            iconName="lock" 
            placeholder="Ingresa tu contraseña" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <CustomButton 
            title="Iniciar Sesión" 
            onPress={handleLogin} 
            variant="secondary" 
            loading={loading}
            style={styles.loginBtn}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ciruela,
    letterSpacing: 2,
  },
  logoTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  logoSlogan: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ciruela,
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 12,
  },
  forgotPasswordText: {
    color: COLORS.ciruela,
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    height: 55,
    borderRadius: 20,
    marginTop: 15,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: COLORS.ciruela,
    fontSize: 15,
  },
  registerLink: {
    color: COLORS.ciruela,
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});