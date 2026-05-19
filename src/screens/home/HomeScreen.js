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
import HeartIcon from '../../assets/heart-icon';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  
  const servicios = [
    { id: '1', nombre: 'Guardería', img: require('../../assets/guarde.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Guardería' } },
    { id: '2', nombre: 'Spa', img: require('../../assets/spaaaa.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Spa' } },
    { id: '3', nombre: 'Tienda', img: require('../../assets/shopPet.jpeg'), destino: 'Tienda', params: null },
  ];

  const masSolicitados = [
    { id: '1', nombre: 'Paseos', img: require('../../assets/pase.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Paseos' } },
    { id: '2', nombre: 'Baño & Spa', img: require('../../assets/baños.jpeg'), destino: 'ReservarServicio', params: { servicio: 'Spa' } },
    { id: '3', nombre: 'Comida', img: require('../../assets/comida.png'), destino: 'Tienda', params: null },
  ];

  // Helper centralizado para manejar la navegación de cualquier tarjeta
  const handleNavigation = (item) => {
    if (item.params) {
      navigation.navigate(item.destino, item.params);
    } else {
      navigation.navigate(item.destino);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Hola, Ana!</Text>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* --- BANNER PRINCIPAL --- */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>
              Ellos se merecen lo mejor {"  "}      
              <View style={styles.heartInlineContainer}>
                <HeartIcon 
                  color={COLORS.oro || '#D4AF37'} 
                  size={24} 
                />
              </View>
            </Text>
            <Text style={styles.bannerSubTitle}>Servicios y productos pensados para su felicidad</Text>
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
            <TouchableOpacity 
              key={item.id} 
              style={styles.serviceCard}
              onPress={() => handleNavigation(item)}
              activeOpacity={0.8}
            >
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
            <TouchableOpacity 
              key={item.id} 
              style={styles.serviceCard}
              onPress={() => handleNavigation(item)}
              activeOpacity={0.8}
            >
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
  safeArea: { flex: 1, backgroundColor: COLORS.white},
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginTop: 45,
    marginBottom: 16,
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: COLORS.ciruela, flex: 1 },
  headerLogo: { width: 120, height: 60, flex: 1, marginTop: 20 },
  notificationButton: { width: 40, alignItems: 'flex-end', flex: 0.5 },

  // Banner
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 130,
    marginBottom: 30,
    overflow: 'hidden'
  },
  bannerTextContainer: { width: '60%' },
  bannerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', lineHeight: 22},
  
  heartInlineContainer: {
    width: 20,
    height: 18,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:2 
  },
  
  bannerSubTitle: { color: COLORS.white, fontSize: 13, lineHeight: 20, marginTop: 10 },
  bannerImage: { width: '45%', height: 150, position: 'absolute', right: 0, bottom: -10 },

  // Secciones Comunes
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ciruela },
  horizontalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 40 
  },
  serviceCard: {
    width: (width - 32 - 24) / 3,
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