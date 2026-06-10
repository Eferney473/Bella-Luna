import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { COLORS } from '../../config/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { FirebaseService } from '../../config/firebaseService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor rellena todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await FirebaseService.loginUser(email, password);
    } catch (e) {
      // El error ya es manejado en el servicio
    } finally {
      setLoading(false);
    }
  };

  // Función de recuperación compatible con Android e iOS
  const handleForgotPassword = async () => {
    // Validamos que el usuario haya escrito su correo en el input principal
    if (!email || !email.trim()) {
      Alert.alert(
        "Correo requerido", 
        "Por favor, ingresa tu correo electrónico en el campo de texto de arriba y vuelve a presionar '¿Olvidaste tu contraseña?' para enviarte el enlace."
      );
      return;
    }

    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert(
        "Correo enviado", 
        `Hemos enviado un enlace de restablecimiento a: ${email.trim()}. Revisa tu bandeja de entrada o la carpeta de correo no deseado (spam).`
      );
    } catch (error) {
      console.log("Error en recuperación:", error);
      Alert.alert(
        "Error", 
        "No se pudo enviar el correo de recuperación. Asegúrate de que esté bien escrito y registrado."
      );
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

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
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
}

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