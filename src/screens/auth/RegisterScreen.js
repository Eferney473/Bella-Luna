import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../config/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

import { FirebaseService } from '../../config/firebaseService';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await FirebaseService.registerUser(name, phone, email, password);
      alert("¡Cuenta creada con éxito!");
      navigation.navigate('Login');
    } catch (e) {
      // Manejado en el servicio
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera curva */}
      <View style={styles.curvedHeader}>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <Text style={styles.headerSubtitle}>Únete a la familia Bella Luna y cuida a tus consentidos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <CustomInput 
            label="Nombre Completo" 
            iconName="user" 
            placeholder="Tu nombre y apellido" 
            value={name}
            onChangeText={setName}
          />
          <CustomInput 
            label="Correo Electrónico" 
            iconName="mail" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput 
            label="Número de Celular" 
            iconName="phone" 
            placeholder="+57 300 000 0000" 
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <CustomInput 
            label="Contraseña" 
            iconName="lock" 
            placeholder="Crea una contraseña segura" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton 
            title="Registrarme Ahora" 
            onPress={handleRegister} 
            variant="secondary" 
            loading={loading}
            style={styles.registerBtn}
          />

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  curvedHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.ciruela,
    marginTop: 5,
    lineHeight: 18,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  formContainer: {
    width: '100%',
  },
  registerBtn: {
    height: 55,
    borderRadius: 20,
    marginTop: 25,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  footerText: {
    color: COLORS.textMedium,
  },
  loginLink: {
    color: COLORS.ciruela,
    fontWeight: 'bold',
  },
});