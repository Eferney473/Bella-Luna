import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  SafeAreaView, 
  StyleSheet,
  KeyboardAvoidingView, // Importado para evitar que el teclado tape el input
  ScrollView,           // Importado para permitir el desplazamiento con el teclado arriba
  Platform 
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Comportamiento dinámico para empujar los elementos cuando se abre el teclado */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
        >
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
                secureTextEntry={secureText} // Esto activa los asteriscos/puntos nativos automáticamente
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                placeholderTextColor={COLORS.textLight}
                color={COLORS.ciruela}
                style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeButton}>
                <Text style={styles.eyeIcon}>{secureText ? "👁️" : "🙈"}</Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' }, // Asegura el centrado vertical con scroll libre
  container: { paddingHorizontal: 24, paddingVertical: 16 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 250, height: 200 },
  input: {
    width: '100%', // Corregido el valor 'full' string inválido por estándar 100%
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
  eyeIcon: { fontSize: 18 }, // Estilo limpio asignado al ojo gráfico
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