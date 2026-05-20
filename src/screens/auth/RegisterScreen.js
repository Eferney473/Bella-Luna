import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    Alert.alert(
      "¡Registro Simulado!",
      "Tu usuario ha sido creado de manera exitosa en esta demo.",
      [{ text: "Excelente", onPress: () => navigation.replace('Home') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* --- BANNER SUPERIOR ASIMÉTRICO (Rompe el diseño plano) --- */}
          <View style={styles.topBanner}>
            {/* <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity> */}
            <Text style={styles.bannerTitle}>Crear Cuenta</Text>
            <Text style={styles.bannerSubtitle}>Únete a la familia Bella Luna y cuida a tus consentidos</Text>
          </View>

          {/* --- CUERPO DEL FORMULARIO --- */}
          <View style={styles.formCard}>
            
            {/* Input Nombre */}
            <Text style={styles.inputLabel}>Nombre Completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Tu nombre y apellido"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

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

            {/* Input Celular */}
            <Text style={styles.inputLabel}>Número de Celular</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="+57 300 000 0000"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Input Contraseña */}
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Crea una contraseña segura"
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

            {/* Botón Llamativo de Registro */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.9}>
              <Text style={styles.registerButtonText}>Registrarme Ahora</Text>
            </TouchableOpacity>

          </View>

          {/* Enlace para volver al Login */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F6' },
  scrollContainer: { flexGrow: 1, paddingBottom: 30 },
  
  // Banner Superior Curvo
  topBanner: {
    backgroundColor: COLORS.primary || '#149284',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative'
  },
  backArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 8 },
  bannerSubtitle: { fontSize: 15, color: COLORS.ciruela, lineHeight: 20 },

  // Contenedor del Formulario flotando ligeramente sobre el fondo
  formCard: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.ciruela, marginBottom: 8, marginLeft: 4 },
  
  // Inputs con iconos integrados
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

  // Botón Principal Renovado
  registerButton: {
    backgroundColor: COLORS.ciruela || '#59374F',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  registerButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 10 },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: COLORS.ciruela || '#149284', fontWeight: 'bold', fontSize: 14, }
});