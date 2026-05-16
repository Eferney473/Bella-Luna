import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', confirmPassword: '' });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

        <TextInput placeholder="Nombre completo" placeholderTextColor={COLORS.textLight}color={COLORS.textDark} style={styles.input} />
        <TextInput placeholder="Correo electrónico" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.textLight} style={styles.input} color={COLORS.textDark} />
        <TextInput placeholder="Número de teléfono" keyboardType="phone-pad" placeholderTextColor={COLORS.textLight} style={styles.input} color={COLORS.textDark} />
        <TextInput placeholder="Contraseña" secureTextEntry autoCapitalize="none" placeholderTextColor={COLORS.textLight} style={styles.input} color={COLORS.textDark} />
        <TextInput placeholder="Confirmar contraseña" secureTextEntry autoCapitalize="none" placeholderTextColor={COLORS.textLight} style={styles.input} color={COLORS.textDark} />

        <TouchableOpacity onPress={() => console.log('Registrar')} style={styles.button}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={{ color: COLORS.gray }}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center', marginBottom: 8 },
  subtitle: { color: COLORS.gray, textAlign: 'center', marginBottom: 32 },
  input: {
    height: 48,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: COLORS.secondary, fontWeight: 'bold' },
});