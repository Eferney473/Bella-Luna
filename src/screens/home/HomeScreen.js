import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Datos simulados para las listas (luego vendrán de Firestore)
  const servicios = [
    { id: '1', nombre: 'Guardería', img: require('../../assets/guarderia1.jpeg') },
    { id: '2', nombre: 'Spa', img: require('../../assets/spa.jpeg') },
    { id: '3', nombre: 'PetShop', img: require('../../assets/petshop.jpeg') },
  ];

  const masSolicitados = [
    { id: '1', nombre: 'Paseos', img: require('../../assets/paseo.png') },
    { id: '2', nombre: 'Baño & Spa', img: require('../../assets/baño.jpeg') },
    { id: '3', nombre: 'Alimentos', img: require('../../assets/guarderia1.jpeg') },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Iconos del celular de la parte superior siempre visibles */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.textDark} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* --- HEADER (Todo en la misma línea) --- */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Hola, Ana!</Text>
          <Image 
            source={require('../../assets/flyer2.jpeg')} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          <TouchableOpacity style={styles.notificationButton}>
            {/* Campana nativa emulada con texto o icono */}
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* --- BANNER PRINCIPAL --- */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>El lugar perfecto para su felicidad</Text>
            <Text style={{ fontSize: 16, marginTop: 4 }}>♥ ✨</Text>
          </View>
          <Image 
            source={require('../../assets/perroHome.jpg')} 
            style={styles.bannerImage} 
            resizeMode="contain"
          />
        </View>

        {/* --- SECCIÓN SERVICIOS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Servicios</Text>
        </View>
        
        <View style={styles.horizontalRow}>
          {servicios.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard}>
              <View style={styles.imageContainer}>
                <Image source={item.img} style={styles.cardImage} />
              </View>
              <Text style={styles.cardLabel}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- SECCIÓN MÁS SOLICITADO --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Más solicitado</Text>
        </View>

        <View style={styles.horizontalRow}>
          {masSolicitados.map((item) => (
            <TouchableOpacity key={item.id} style={styles.serviceCard}>
              <View style={styles.imageContainer}>
                <Image source={item.img} style={styles.cardImage} />
              </View>
              <Text style={styles.cardLabel}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginTop: 8,
    marginBottom: 16,
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela, flex: 1 },
  headerLogo: { width: 100, height: 40, flex: 1 },
  notificationButton: { width: 40, alignItems: 'flex-end', flex: 0.5 },

  // Banner
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 130,
    marginBottom: 24,
    overflow: 'hidden'
  },
  bannerTextContainer: { width: '55%' },
  bannerText: { color: COLORS.ciruela, fontSize: 18, fontWeight: 'bold', lineHeight: 22 },
  bannerImage: { width: '45%', height: 140, position: 'absolute', right: 0, bottom: -10 },

  // Secciones Comunes
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela },
  horizontalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 24 
  },
  serviceCard: {
    width: (width - 32 - 24) / 3, // Divide el espacio exacto restando márgenes
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardLabel: { marginTop: 8, fontSize: 14, fontWeight: '600', color: COLORS.textDark, textAlign: 'center' }
});