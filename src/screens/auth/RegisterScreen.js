import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  SafeAreaView, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  // Estado unificado para capturar los datos
  const [form, setForm] = useState({ 
    nombre: '', 
    email: '', 
    telefono: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Función manejadora para actualizar el estado de forma dinámica
  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = () => {
    console.log('Datos listos para registrar en Firebase:', form);
    // Aquí conectarás tu Auth a futuro. Por ahora te simula el paso directo a la App:
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>

          {/* --- CAMPO: NOMBRE --- */}
          <TextInput 
            placeholder="Nombre completo" 
            placeholderTextColor={COLORS.textLight}
            value={form.nombre}
            onChangeText={(val) => handleInputChange('nombre', val)}
            style={styles.input} 
          />

          {/* --- CAMPO: CORREO --- */}
          <TextInput 
            placeholder="Correo electrónico" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            placeholderTextColor={COLORS.textLight} 
            value={form.email}
            onChangeText={(val) => handleInputChange('email', val)}
            style={styles.input} 
          />

          {/* --- CAMPO: TELÉFONO --- */}
          <TextInput 
            placeholder="Número de teléfono" 
            keyboardType="phone-pad" 
            placeholderTextColor={COLORS.textLight} 
            value={form.telefono}
            onChangeText={(val) => handleInputChange('telefono', val)}
            style={styles.input} 
          />

          {/* --- CAMPO: CONTRASEÑA --- */}
          <TextInput 
            placeholder="Contraseña" 
            secureTextEntry={true}
            autoCapitalize="none" 
            autoCorrect={false}
            textContentType="oneTimeCode" // Evita bloqueos de autocompletado en registros
            placeholderTextColor={COLORS.textLight} 
            value={form.password}
            onChangeText={(val) => handleInputChange('password', val)}
            style={styles.input} 
          />

          {/* --- CAMPO: CONFIRMAR CONTRASEÑA --- */}
          <TextInput 
            placeholder="Confirmar contraseña" 
            secureTextEntry={true}
            autoCapitalize="none" 
            autoCorrect={false}
            textContentType="oneTimeCode"
            placeholderTextColor={COLORS.textLight} 
            value={form.confirmPassword}
            onChangeText={(val) => handleInputChange('confirmPassword', val)}
            style={styles.input} 
          />

          {/* --- BOTÓN DE ACCIÓN --- */}
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </TouchableOpacity>

          {/* --- ENLACE DE RETORNO --- */}
          <View style={styles.loginContainer}>
            <Text style={{ color: COLORS.textMedium || '#6B7280' }}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela, textAlign: 'center', marginBottom: 8 },
  subtitle: { color: COLORS.textLight, textAlign: 'center', marginBottom: 32 },
  input: {
    height: 48,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    borderRadius: 20,
    // Forzamos un color de texto oscuro estándar en caso de fallas en el archivo de colores
    color: '#111827', 
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    fontSize: 14,
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