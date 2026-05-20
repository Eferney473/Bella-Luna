import React, { useState } from 'react';
import { 
  View, 
  Text,
  Image, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Flujo simulado de autenticación exitosa
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Cabecera / Bienvenida */}
          <View style={styles.welcomeHeader}>
            {/* <Text style={styles.emojiLogo}>🐶✨</Text> */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logoLogin.jpg')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {/* <Text style={styles.welcomeTitle}>¡Bienvenidos!</Text> */}
            {/* <Text style={styles.welcomeSubtitle}>Ingresa a tu cuenta para consentir a tu mascota</Text> */}
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            
            {/* Input Correo */}
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input Contraseña */}
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Olvidé mi contraseña */}
            <TouchableOpacity style={styles.forgotBtn} onPress={() => alert('Recuperar contraseña en desarrollo')}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Botón Llamativo */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

          </View>

          {/* Footer Alternativo */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#70C1B3' },
  scrollContainer: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  
  welcomeHeader: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  // emojiLogo: { fontSize: 42, marginBottom: 12 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 250, height: 200 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 8 },
  welcomeSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },

  formContainer: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.ciruela, marginBottom: 8, marginLeft: 4 },
  
  // Contenedor del Input con Icono Interno
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white || '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECE7',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, color: '#1F2937', fontSize: 15, height: '100%' },
  eyeIcon: { padding: 4 },

  forgotBtn: { alignItems: 'flex-end', marginBottom: 28, marginTop: -4 },
  forgotText: { color: '#59374F', fontSize: 13, fontWeight: '500' },

  // Botón Principal Ultra Llamativo
  primaryButton: {
    backgroundColor: COLORS.ciruela || '#59374F',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  footerText: { color: '#806b6b', fontSize: 14 },
  footerLink: { color: COLORS.ciruela || '#59374F', fontWeight: 'bold', fontSize: 14}
});