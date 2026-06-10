import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Modal, TextInput, ScrollView, Switch } from 'react-native';
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

  // Estados para Modales de Edición de Menú
  const [editDataVisible, setEditDataVisible] = useState(false);
  const [editNotifVisible, setEditNotifVisible] = useState(false);
  const [editAddressVisible, setEditAddressVisible] = useState(false);

  // Campos de Formularios
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [updatingUser, setUpdatingUser] = useState(false);

  // Controladores de Switches de Alertas
  const [notifCitas, setNotifCitas] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  const unsubscribeUserRef = useRef(null);
  const unsubscribeCitasRef = useRef(null);
  const unsubscribeMascotasRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'BL';
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0].substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    unsubscribeUserRef.current = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          setUserData(data);
          setNewName(data.name || '');
          setNewPhone(data.phone || '');
          setNewAddress(data.address || '');
        }
      }, error => console.log("Error cargando perfil:", error.message));

    unsubscribeCitasRef.current = firestore()
      .collection('appointments')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        setTotalCitas(querySnapshot ? querySnapshot.size : 0);
      }, error => console.log("Error contando citas:", error.message));

    unsubscribeMascotasRef.current = firestore()
      .collection('pets')
      .where('ownerId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        setTotalMascotas(querySnapshot ? querySnapshot.size : 0);
        setLoading(false);
      }, error => {
        console.log("Error contando mascotas:", error.message);
        setLoading(false);
      });

    return () => {
      if (unsubscribeUserRef.current) unsubscribeUserRef.current();
      if (unsubscribeCitasRef.current) unsubscribeCitasRef.current();
      if (unsubscribeMascotasRef.current) unsubscribeMascotasRef.current();
    };
  }, []);

  const detenerSuscripcionesManualmente = () => {
    if (unsubscribeUserRef.current) { unsubscribeUserRef.current(); unsubscribeUserRef.current = null; }
    if (unsubscribeCitasRef.current) { unsubscribeCitasRef.current(); unsubscribeCitasRef.current = null; }
    if (unsubscribeMascotasRef.current) { unsubscribeMascotasRef.current(); unsubscribeMascotasRef.current = null; }
  };

  // Guardar Cambios Generales de Datos Personales
  const handleUpdateProfile = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Campos obligatorios', 'Por favor completa tu nombre y celular.');
      return;
    }
    try {
      setUpdatingUser(true);
      const currentUser = auth().currentUser;
      await firestore().collection('users').doc(currentUser.uid).update({
        name: newName,
        phone: newPhone
      });
      setUpdatingUser(false);
      setEditDataVisible(false);
      Alert.alert('Completado', 'Tus datos básicos se actualizaron.');
    } catch (error) {
      setUpdatingUser(false);
      Alert.alert('Error', 'No pudimos procesar los cambios.');
    }
  };

  // Guardar Cambios de Dirección Física
  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) {
      Alert.alert('Campo vacío', 'Ingresa una dirección de residencia válida.');
      return;
    }
    try {
      setUpdatingUser(true);
      const currentUser = auth().currentUser;
      await firestore().collection('users').doc(currentUser.uid).update({
        address: newAddress
      });
      setUpdatingUser(false);
      setEditAddressVisible(false);
      Alert.alert('Éxito', 'Dirección de entrega asignada correctamente.');
    } catch (error) {
      setUpdatingUser(false);
      Alert.alert('Error', 'Problema al almacenar tu dirección.');
    }
  };

  // Trigger Seguro de Cambio de Contraseña mediante Email Oficial
  const handleChangePassword = () => {
    if (!userData || !userData.email) return;
    
    Alert.alert(
      "Modificar Contraseña",
      `Te enviaremos un correo electrónico de seguridad a: ${userData.email} para que reescribas tu contraseña de forma privada y protegida. ¿Proceder?`,
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Enviar Correo",
          onPress: async () => {
            try {
              await auth().sendPasswordResetEmail(userData.email);
              Alert.alert("Solicitud Enviada", "Revisa tu bandeja de entrada o correos no deseados.");
            } catch (error) {
              Alert.alert("Error", "No se pudo despachar el correo de restablecimiento.");
            }
          }
        }
      ]
    );
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
              detenerSuscripcionesManualmente();
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
        <ActivityIndicator size="large" color={COLORS.primary || '#5A344E'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.ciruela || '#5A344E'} barStyle="light-content" />
      
      {/* HEADER PRINCIPAL */}
      <View style={styles.purpleHeaderContainer}>
        <Text style={styles.headerTitle}>Mi perfil</Text>
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(userData?.name)}</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{userData?.name || 'Usuario Bella Luna'}</Text>
            <Text style={styles.profileEmail}>{userData?.email || 'correo@bellaluna.com'}</Text>
            <Text style={styles.profilePhone}>{userData?.phone || 'Sin número registrado'}</Text>
          </View>
        </View>
      </View>

      {/* MÉTRICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: COLORS.ciruela || '#5A344E' }]}>{totalCitas}</Text>
          <Text style={styles.statLabel}>Citas totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#0EA5E9' }]}>{totalMascotas}</Text>
          <Text style={styles.statLabel}>Mascotas</Text>
        </View>
      </View>

      {/* MENÚ COMPLETO DE SECCIONES */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setEditDataVisible(true)}>
          <Text style={styles.menuItemText}>Datos personales</Text>
          <View style={styles.actionRowRight}>
            <Text style={styles.actionLabelSmall}>Editar</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setEditNotifVisible(true)}>
          <Text style={styles.menuItemText}>Notificaciones</Text>
          <View style={styles.actionRowRight}>
            <Text style={styles.actionLabelSmall}>Configurar</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setEditAddressVisible(true)}>
          <Text style={styles.menuItemText}>Mis direcciones</Text>
          <View style={styles.actionRowRight}>
            <Text style={[styles.actionLabelSmall, { maxWidth: 100 }]} numberOfLines={1}>
              {userData?.address ? userData.address : "Añadir"}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleChangePassword}>
          <Text style={styles.menuItemText}>Cambiar contraseña</Text>
          <View style={styles.actionRowRight}>
            <Text style={styles.actionLabelSmall}>Gestionar</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
          </View>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButtonTextOnly} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* ================= MODAL 1: DATOS PERSONALES ================= */}
      <Modal visible={editDataVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar datos personales</Text>
              <TouchableOpacity onPress={() => setEditDataVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%' }}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput style={styles.textInput} value={newName} onChangeText={setNewName} />
              <Text style={styles.inputLabel}>Teléfono de contacto</Text>
              <TextInput style={styles.textInput} value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={updatingUser}>
                {updatingUser ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: NOTIFICACIONES ================= */}
      <Modal visible={editNotifVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajustes de alertas</Text>
              <TouchableOpacity onPress={() => setEditNotifVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.switchTitle}>Recordatorios de Citas</Text>
                <Text style={styles.switchDesc}>Avisarme antes de que le toque el Spa o Guardería a mi mascota.</Text>
              </View>
              <Switch value={notifCitas} onValueChange={setNotifCitas} trackColor={{ true: COLORS.primary }} />
            </View>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.switchTitle}>Promociones</Text>
                <Text style={styles.switchDesc}>Recibir alertas de descuentos especiales del PetShop.</Text>
              </View>
              <Switch value={notifPromos} onValueChange={setNotifPromos} trackColor={{ true: COLORS.primary }} />
            </View>
            <TouchableOpacity style={[styles.saveButton, { marginTop: 25 }]} onPress={() => setEditNotifVisible(false)}>
              <Text style={styles.saveButtonText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 3: MIS DIRECCIONES ================= */}
      <Modal visible={editAddressVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dirección de Residencia</Text>
              <TouchableOpacity onPress={() => setEditAddressVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%' }}>
              <Text style={styles.inputLabel}>Ubicación / Domicilio de entrega</Text>
              <TextInput 
                style={styles.textInput} 
                value={newAddress} 
                onChangeText={setNewAddress} 
                placeholder="Calle, Avenida, Conjunto, Apto..."
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateAddress} disabled={updatingUser}>
                {updatingUser ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveButtonText}>Establecer Dirección</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  purpleHeaderContainer: { backgroundColor: COLORS.ciruela || '#5A344E', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 55, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 30, marginBottom: 5 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  avatarCircle: { width: 75, height: 75, backgroundColor: '#FACC15', borderRadius: 37.5, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#5A344E' },
  profileTextContainer: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 19, fontWeight: 'bold', color: '#FFFFFF' },
  profileEmail: { fontSize: 13, color: '#E2E8F0', marginTop: 1 },
  profilePhone: { fontSize: 13, color: '#E2E8F0', marginTop: 1 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -35, marginBottom: 35 },
  statCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  menuContainer: { backgroundColor: '#FFFFFF', marginHorizontal: 20, borderRadius: 20, paddingHorizontal: 16, borderWidth: 1, borderColor: '#EDF2F7', elevation: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuItemText: { fontSize: 15, color: '#334155', fontWeight: '500' },
  actionRowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionLabelSmall: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  logoutButtonTextOnly: { alignSelf: 'center', marginTop: 'auto', marginBottom: 35, padding: 10 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 24, alignItems: 'center', minHeight: 350 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6, marginTop: 12, alignSelf: 'flex-start' },
  textInput: { width: '100%', height: 48, backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14, color: '#334155' },
  saveButton: { width: '100%', height: 50, backgroundColor: '#5A344E', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  switchTitle: { fontSize: 15, fontWeight: '600', color: '#334155' },
  switchDesc: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 16 }
});