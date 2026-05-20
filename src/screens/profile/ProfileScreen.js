import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  StatusBar
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  
  const menuOptions = [
    { id: '1', title: 'Datos personales' },
    { id: '2', title: 'Notificaciones' },
    { id: '3', title: 'Mis direcciones' },
    { id: '4', title: 'Cambiar contraseña' },
  ];

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
            {/* Avatar con Iniciales (AG) */}
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>AG</Text>
            </View>
            <View style={styles.textInfo}>
              <Text style={styles.userName}>Ana García</Text>
              <Text style={styles.userEmail}>ana@email.com</Text>
              <Text style={styles.userPhone}>311 5572056</Text>
            </View>
          </View>
        </View>

        {/* --- ESTADÍSTICAS (OVERLAP) --- */}
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

        {/* --- MENÚ AGRUPADO --- */}
        <View style={styles.menuGroup}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity 
              key={option.id} 
              style={[
                styles.menuItem, 
                index === menuOptions.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => alert(`${option.title} en desarrollo`)}
              activeOpacity={0.6}
            >
              <Text style={styles.menuText}>{option.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  scrollView: { flex: 1 },
  
  // Header Plum Section
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
    fontSize: 18,
    fontWeight: '500',
    marginTop: 50
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  initialsAvatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#FFD700', // Amarillo del diseño
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.ciruela,
  },
  textInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -35,
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: COLORS.white,
    width: '48%',
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Menu Grouped
  menuGroup: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '400',
  },

  // Logout
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoutText: {
    color: COLORS.accent, // Color ciruela como el texto de la guía
    fontSize: 18,
    fontWeight: '500',
  }
});