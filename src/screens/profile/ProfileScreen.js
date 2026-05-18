import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { COLORS } from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  
  const menuOptions = [
    { id: '1', title: 'Información personal', icon: '👤' },
    { id: '2', title: 'Métodos de pago', icon: '💳' },
    { id: '3', title: 'Direcciones', icon: '📍' },
    { id: '4', title: 'Notificaciones', icon: '🔔' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- BANNER DE PERFIL --- */}
        <View style={styles.profileHeader}>
          <Image 
            source={require('../../assets/foto.png')} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>Ana García</Text>
          <Text style={styles.userDetail}>ana.garcia@email.com</Text>
          <Text style={styles.userDetail}> +57 300 123 4567</Text>
        </View>

        {/* --- CONTADORES EN RECUADROS (Mascotas y Citas) --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={{ fontSize: 20 }}>🐾</Text>
            <Text style={styles.statTitle}>Mascotas</Text>
            <Text style={styles.statNumber}>2</Text>
            <TouchableOpacity><Text style={styles.statLink}>Ver detalles</Text></TouchableOpacity>
          </View>

          <View style={styles.statBox}>
            <Text style={{ fontSize: 20 }}>📅</Text>
            <Text style={styles.statTitle}>Citas totales</Text>
            <Text style={styles.statNumber}>8</Text>
            <TouchableOpacity><Text style={styles.statLink}>Ver historial</Text></TouchableOpacity>
          </View>
        </View>

        {/* --- MENÚ DE OPCIONES --- */}
        <View style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{option.icon}</Text>
                <Text style={styles.menuText}>{option.title}</Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- BOTÓN CERRAR SESIÓN --- */}
        <View style={{ paddingHorizontal: 24, marginTop: 16, marginBottom: 32 }}>
          <TouchableOpacity 
            onPress={() => navigation.replace('Login')}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  
  // Header Banner
  profileHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 6 },
  userDetail: { fontSize: 15, color: COLORS.white, marginBottom: 5 },

  // Stats Boxes
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: -20, // Monta ligeramente las cajas sobre el fondo menta suave
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: COLORS.white,
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: { fontSize: 13, color: COLORS.textMedium, fontWeight: '500', marginTop: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.ciruela, marginVertical: 2 },
  statLink: { fontSize: 11, color: COLORS.secondary, textDecorationLine: 'underline', fontWeight: '600' },

  // Menu List
  menuContainer: { paddingHorizontal: 24, marginBottom: 16 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuText: { fontSize: 15, color: COLORS.textDark, fontWeight: '500' },
  arrowIcon: { fontSize: 24, color: COLORS.textLight },

  // Logout Button
  logoutButton: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  logoutText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 16 }
});