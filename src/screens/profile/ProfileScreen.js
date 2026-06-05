// src/screens/profile/ProfileScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FirebaseService } from '../../config/firebaseService';
import { COLORS } from '../../config/colors';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [totalCitas, setTotalCitas] = useState(0);
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [loading, setLoading] = useState(true);

  // Usamos referencias para guardar las funciones de desuscripción de Firestore
  const unsubscribeUserRef = useRef(null);
  const unsubscribeCitasRef = useRef(null);
  const unsubscribeMascotasRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'BL';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // 1. Guardamos la desuscripción del Usuario
    unsubscribeUserRef.current = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          setUserData(doc.data());
        }
      }, error => console.log("Suscripción usuario cancelada o error:", error.message));

    // 2. Guardamos la desuscripción de Citas
    unsubscribeCitasRef.current = firestore()
      .collection('appointments')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        setTotalCitas(querySnapshot ? querySnapshot.size : 0);
      }, error => console.log("Suscripción citas cancelada o error:", error.message));

    // 3. Guardamos la desuscripción de Mascotas
    unsubscribeMascotasRef.current = firestore()
      .collection('pets')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        setTotalMascotas(querySnapshot ? querySnapshot.size : 0);
        setLoading(false);
      }, error => {
        console.log("Suscripción mascotas cancelada o error:", error.message);
        setLoading(false);
      });

    // Limpieza estándar cuando el componente se destruye de forma natural
    return () => {
      if (unsubscribeUserRef.current) unsubscribeUserRef.current();
      if (unsubscribeCitasRef.current) unsubscribeCitasRef.current();
      if (unsubscribeMascotasRef.current) unsubscribeMascotasRef.current();
    };
  }, []);

  // Función de apagado manual controlado para evitar crasheos al cerrar sesión
  const detenerSuscripcionesManualmente = () => {
    if (unsubscribeUserRef.current) {
      unsubscribeUserRef.current();
      unsubscribeUserRef.current = null;
    }
    if (unsubscribeCitasRef.current) {
      unsubscribeCitasRef.current();
      unsubscribeCitasRef.current = null;
    }
    if (unsubscribeMascotasRef.current) {
      unsubscribeMascotasRef.current();
      unsubscribeMascotasRef.current = null;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de Bella Luna?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            try {
              // Primero apagamos las lecturas de base de datos
              detenerSuscripcionesManualmente();
              
              // Luego, cerramos la sesión de forma segura
              await FirebaseService.logoutUser();
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.ciruela} barStyle="light-content" />
      
      {/* HEADER CURVO CIRUELA (Puntos removidos para evitar botones fantasma) */}
      <View style={styles.purpleHeaderContainer}>
        <View style={styles.topRow}>
          <Text style={styles.headerTitle}>Mi perfil</Text>
        </View>

        {/* PERFIL ROW (AVATAR + INFO RÁPIDA) */}
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(userData?.name)}</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{userData?.name || 'Usuario Bella Luna'}</Text>
            <Text style={styles.profileEmail}>{userData?.email || 'sin-email@bellaluna.com'}</Text>
            <Text style={styles.profilePhone}>{userData?.phone || 'Sin teléfono'}</Text>
          </View>
        </View>
      </View>

      {/* CONTADORES */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.ciruela }]}>{totalCitas}</Text>
          <Text style={styles.statLabel}>Citas totales</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#0EA5E9' }]}>{totalMascotas}</Text>
          <Text style={styles.statLabel}>Mascotas</Text>
        </View>
      </View>

      {/* MENÚ DE OPCIONES */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Datos personales</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notificaciones</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Mis direcciones</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <Text style={styles.menuItemText}>Cambiar contraseña</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* CERRAR SESIÓN */}
      <TouchableOpacity style={styles.logoutButtonTextOnly} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  purpleHeaderContainer: { backgroundColor: COLORS.ciruela, paddingHorizontal: 20, paddingTop: 30, paddingBottom: 50, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 75, height: 75, backgroundColor: '#FACC15', borderRadius: 37.5, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela },
  profileTextContainer: { marginLeft: 16 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  profileEmail: { fontSize: 13, color: '#E2E8F0', marginTop: 2 },
  profilePhone: { fontSize: 13, color: '#E2E8F0', marginTop: 1 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -35, marginBottom: 25 },
  statCard: { width: '47%', backgroundColor: COLORS.white, borderRadius: 20, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  menuContainer: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuItemText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  logoutButtonTextOnly: { alignSelf: 'center', marginTop: 'auto', marginBottom: 35, padding: 10 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' }
});