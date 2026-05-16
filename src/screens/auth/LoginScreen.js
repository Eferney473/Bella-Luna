import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/Logo-Texto.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor={COLORS.textLight}
          color={COLORS.textDark}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
            placeholderTextColor={COLORS.textLight}
            color={COLORS.textDark}
            style={[styles.input, { mb: 0, flex: 1 }]}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeButton}>
            <Text style={styles.eyeText}>{secureText ? "MOSTRAR" : "OCULTAR"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => console.log('Recuperar')} style={styles.forgotButton}>
          <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={{ color: COLORS.gray }}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 250, height: 200 },
  input: {
    width: 'full',
    height: 48,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  eyeButton: { position: 'absolute', right: 16, height: '100%', justifyContent: 'center' },
  eyeText: { color: COLORS.secondary, fontSize: 12, fontWeight: 'bold' },
  forgotButton: { alignItems: 'center', marginBottom: 24 },
  forgotText: { color: COLORS.secondary, textDecorationLine: 'underline', fontSize: 14 },
  loginButton: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  registerText: { color: COLORS.primary, fontWeight: 'bold' },
});