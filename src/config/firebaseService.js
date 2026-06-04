// src/config/firebaseService.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export const FirebaseService = {
  // 1. Registro de Usuario e Inserción en Firestore
  registerUser: async (name, phone, email, password) => {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      // Guardar los datos extendidos del perfil en Firestore
      await firestore().collection('users').doc(uid).set({
        uid,
        name,
        phone,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      return userCredential.user;
    } catch (error) {
      console.error("Error en registro: ", error);
      let errorMessage = "No se pudo completar el registro.";
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Ese correo ya está registrado.';
      if (error.code === 'auth/invalid-email') errorMessage = 'El formato del correo no es válido.';
      if (error.code === 'auth/weak-password') errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      
      Alert.alert("Error de Registro", errorMessage);
      throw error;
    }
  },

  // 2. Inicio de Sesión
  loginUser: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error en login: ", error);
      let errorMessage = "Credenciales incorrectas.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Correo o contraseña incorrectos.';
      }
      Alert.alert("Error de Acceso", errorMessage);
      throw error;
    }
  },

  // 3. Cerrar Sesión
  logoutUser: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  }
};