import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Switch,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  
  // --- ESTADOS DE CONTROL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [currentView, setCurrentView] = useState(''); // 'datos', 'notificaciones', 'direcciones', 'password'

  // --- ESTADOS FORMULARIOS (DATOS PERSONALES) ---
  const [nombre, setNombre] = useState('Ana García');
  const [email, setEmail] = useState('ana@email.com');
  const [telefono, setTelefono] = useState('311 5572056');

  // --- ESTADOS NOTIFICACIONES ---
  const [notiCitas, setNotiCitas] = useState(true);
  const [notiPromos, setNotiPromos] = useState(false);
  const [notiRecordatorios, setNotiRecordatorios] = useState(true);

  // --- ESTADOS CONTRASEÑA ---
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // --- ESTADO DIRECCIONES SIMULADAS ---
  const [direcciones, setDirecciones] = useState([
    { id: '1', etiqueta: 'Casa 🏡', detalle: 'Calle 122 # 15 - 45, Apt 402, Bogotá' },
    { id: '2', etiqueta: 'Oficina 🏢', detalle: 'Av. El Dorado # 68c - 20, Piso 5, Bogotá' },
  ]);

  const menuOptions = [
    { id: '1', title: 'Datos personales', icon: 'person-outline', view: 'datos' },
    { id: '2', title: 'Notificaciones', icon: 'notifications-outline', view: 'notificaciones' },
    { id: '3', title: 'Mis direcciones', icon: 'location-outline', view: 'direcciones' },
    { id: '4', title: 'Cambiar contraseña', icon: 'lock-closed-outline', view: 'password' },
  ];

  const handleOpenOption = (view) => {
    setCurrentView(view);
    setModalVisible(true);
  };

  const handleSaveData = () => {
    setModalVisible(false);
    Alert.alert('¡Éxito!', 'Los cambios han sido guardados correctamente.');
  };

  // --- RENDERIZADO INTERNO CONTENIDO DEL MODAL ---
  const renderModalContent = () => {
    switch (currentView) {
      case 'datos':
        return (
          <View>
            <Text style={styles.modalTitle}>Datos personales</Text>
            <Text style={styles.modalSubtitle}>Mantén tu información de contacto actualizada.</Text>
            
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />

            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Tu correo" />

            <Text style={styles.inputLabel}>Teléfono celular</Text>
            <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="Tu teléfono" />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        );

      case 'notificaciones':
        return (
          <View>
            <Text style={styles.modalTitle}>Notificaciones</Text>
            <Text style={styles.modalSubtitle}>Configura qué alertas deseas recibir en tu celular.</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Recordatorios de Citas</Text>
                <Text style={styles.switchSubLabel}>Avisos 24 horas antes de tus baños o spa.</Text>
              </View>
              <Switch value={notiCitas} onValueChange={setNotiCitas} trackColor={{ true: '#149284' }} />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Ofertas y Descuentos</Text>
                <Text style={styles.switchSubLabel}>Promociones de temporada del Pet Shop.</Text>
              </View>
              <Switch value={notiPromos} onValueChange={setNotiPromos} trackColor={{ true: '#149284' }} />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Alertas de Bienestar</Text>
                <Text style={styles.switchSubLabel}>Consejos prácticos para el cuidado de tus mascotas.</Text>
              </View>
              <Switch value={notiRecordatorios} onValueChange={setNotiRecordatorios} trackColor={{ true: '#149284' }} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
              <Text style={styles.saveButtonText}>Actualizar Preferencias</Text>
            </TouchableOpacity>
          </View>
        );

      case 'direcciones':
        return (
          <View>
            <Text style={styles.modalTitle}>Mis direcciones</Text>
            <Text style={styles.modalSubtitle}>Lugares frecuentes para entregas o recogidas.</Text>

            {direcciones.map((dir) => (
              <View key={dir.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressTag}>{dir.etiqueta}</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Eliminar', '¿Eliminar dirección?')}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressDetail}>{dir.detalle}</Text>
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#149284', marginTop: 10 }]} 
              onPress={() => Alert.alert('Nueva dirección', 'Formulario para agregar dirección en desarrollo')}
            >
              <Text style={[styles.saveButtonText, { color: '#149284' }]}>+ Agregar Nueva Dirección</Text>
            </TouchableOpacity>
          </View>
        );

      case 'password':
        return (
          <View>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            <Text style={styles.modalSubtitle}>Tu nueva contraseña debe tener mínimo 6 caracteres.</Text>

            <Text style={styles.inputLabel}>Contraseña actual</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput 
                style={styles.passwordInput} 
                secureTextEntry={secureText} 
                value={oldPassword} 
                onChangeText={setOldPassword}
                placeholder="••••••••" 
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nueva contraseña</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput 
                style={styles.passwordInput} 
                secureTextEntry={secureText} 
                value={newPassword} 
                onChangeText={setNewPassword}
                placeholder="Mínimo 6 caracteres" 
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
              <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ciruela} />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        {/* --- HEADER PLUM (CIRUELA) --- */}
        <View style={styles.headerBanner}>
          <View style={styles.topIcons}>
            <Text style={styles.headerTitle}>Mi perfil</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            {/* Avatar Dinámico con Iniciales basadas en variables */}
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{nombre.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}</Text>
            </View>
            <View style={styles.textInfo}>
              <Text style={styles.userName}>{nombre}</Text>
              <Text style={styles.userEmail}>{email}</Text>
              <Text style={styles.userPhone}>{telefono}</Text>
            </View>
          </View>
        </View>

        {/* --- ESTADÍSTICAS --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.ciruela }]}>12</Text>
            <Text style={styles.statLabel}>Citas totales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#149284' }]}>2</Text>
            <Text style={styles.statLabel}>Mascotas</Text>
          </View>
        </View>

        {/* --- MENÚ AGRUPADO CON ÍCONOS MEJORADOS --- */}
        <View style={styles.menuGroup}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity 
              key={option.id} 
              style={[
                styles.menuItem, 
                index === menuOptions.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => handleOpenOption(option.view)}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={option.icon} size={22} color={COLORS.ciruela} style={styles.menuOptionIcon} />
                <Text style={styles.menuText}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* --- CERRAR SESIÓN --- */}
        <TouchableOpacity 
          onPress={() => navigation.replace('Login')}
          style={styles.logoutContainer}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- MODAL INFERIOR DINÁMICO (BOTTOM SHEET DE OPERACIONES) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragIndicator} />
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#9CA3AF" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {renderModalContent()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollView: { flex: 1 },
  
  headerBanner: {
    backgroundColor: COLORS.ciruela,
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  initialsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  textInfo: { marginLeft: 20 },
  userName: { fontSize: 20, fontWeight: '600', color: COLORS.white, marginBottom: 4 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  userPhone: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: COLORS.white,
    width: '48%',
    height: 85,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  statNumber: { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },

  menuGroup: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuOptionIcon: { marginRight: 14, opacity: 0.9 },
  menuText: { fontSize: 15, color: '#1F2937', fontWeight: '500' },

  logoutContainer: { alignItems: 'center', marginBottom: 40 },
  logoutText: { color: COLORS.accent || '#EF4444', fontSize: 16, fontWeight: 'bold' },

  // --- ESTILOS DEL SECTOR BOTTOM SHEET MODAL ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  dragIndicator: { width: 36, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  closeButton: { alignSelf: 'flex-end', position: 'absolute', top: 12, right: 16, zIndex: 10 },
  modalScroll: { paddingTop: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela, marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 18 },
  
  // Inputs estandarizados
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 15, color: '#1F2937' },
  
  // Inputs Password especializados
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  passwordInput: { flex: 1, fontSize: 15, color: '#1F2937', height: '100%' },
  
  // Toggles de Notificaciones
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  switchTextContainer: { flex: 1, paddingRight: 16 },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  switchSubLabel: { fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 16 },
  
  // Tarjetas de Direcciones
  addressCard: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, marginBottom: 12 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  addressTag: { fontSize: 14, fontWeight: 'bold', color: COLORS.ciruela },
  addressDetail: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  
  // Botón general de guardado
  saveButton: { backgroundColor: '#149284', height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 24, marginBottom: 10 },
  saveButtonText: { color: COLORS.white, fontSize: 15, fontWeight: 'bold' }
});